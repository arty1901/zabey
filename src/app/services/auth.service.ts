import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token;
  private userId;
  private isAuth = false;
  private tokenTimer: any;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router) { }

  login(email: string, password: string) {

    const user = { email, password };

    this.http.post<{
      message?: string,
      userToken: string,
      expireIn: number,
      userId: string
    }>('http://localhost:4000/api/auth/login', user)
      .subscribe(response => {
        /*
        * Сохраняем токен авторизованного пользователя
        * Задаем таймер отсчета и дату, после которого сессия заканчивается
        * Сохраняем данные локально (token, id, ), чтобы при обновлении страницы их не потерять
        * */
        this.token = response.userToken;
        if (this.token) {

          this.userId = response.userId;
          this.isAuth = true;
          this.setAuthTimer(response.expireIn);
          this.authStatusListner.next(true);

          // Дата и время окончания сессии
          const now = new Date();
          const expirationTime = new Date(now.getTime() + response.expireIn * 1000);

          // Сохраняем данные локально
          this.saveAuthData(this.token, this.userId, expirationTime);

          // Перенаправляем на главную страницу после авторизации
          this.router.navigate(['/']);
        }
      });
  }

  signup(email: string, password: string) {
    const newUser = { email, password };

    this.http.post<{
      message?: string,
      result?: any
    }>('http://localhost:4000/api/auth/signup', newUser)
      .subscribe(result => {
        this.router.navigate(['/']);
      });
  }

  logout() {
    this.userId = null;
    this.token = null;
    this.isAuth = false;
    this.authStatusListner.next(false);
    this.removeAuthData();
    clearTimeout(this.tokenTimer);

    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuth;
  }

  getUserId() {
    return this.userId;
  }

  getAuthListner() {
    return this.authStatusListner.asObservable();
  }

  setAuthTimer(time: number): void {
    this.tokenTimer = setTimeout(() => {
      // после окончания времени, должена сработать функция выхода
    }, time * 1000);
  }

  // Автоавторизация
  autoAuth() {
    const authData = this.getAuthData();

    if (!authData) {
      return;
    }

    const now = new Date();
    // Проверяем, не прошло ли время сессии пользователя
    const expireIn = authData.expirationTime.getTime() - now.getTime();

    if (expireIn > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.isAuth = true;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  /*
  * Сохранение данных локально на машине
  * */
  private saveAuthData(token: string, userId: string, expirationTime: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationTime', expirationTime.toISOString());
  }

  private removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationTime = localStorage.getItem('expirationTime');

    if (!token || !expirationTime) {
      return;
    }

    return {token, userId, expirationTime: new Date(expirationTime)};
  }
}
