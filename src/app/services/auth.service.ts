import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {falseIfMissing} from 'protractor/built/util';
import {ɵResourceLoaderImpl} from '@angular/platform-browser-dynamic';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: add error handler for auth

  private token: string;
  private userId: string;
  private tokenTimer: any;
  private authUser = {
    isAuth: false,
    username: '',
    email: ''
  };
  private authStatusListner = new Subject<{
    isAuth: boolean,
    username: string,
    email: string
  }>();

  constructor(private http: HttpClient,
              private router: Router) {
  }

  login(email: string, password: string) {

    const user = {email, password};

    this.http.post<{
      message?: string,
      userToken: string,
      expireIn: number,
      userId: string,
      username: string,
      email: string
    }>('http://localhost:4000/api/auth/login', user)
      .subscribe(response => {
        /*
        * Сохраняем токен авторизованного пользователя
        * Задаем таймер отсчета и дату, после которого сессия заканчивается
        * Сохраняем данные локально (token, id, ), чтобы при обновлении страницы их не потерять
        * */
        this.token = response.userToken;
        if (this.token) {

          this.setAuthTimer(response.expireIn);
          this.userId = response.userId;
          this.authUser = {
            isAuth: true,
            username: response.username,
            email: response.email
          };

          console.log(response.email);

          this.authStatusListner.next({
            isAuth: true,
            username: response.username,
            email: response.email
          });

          // Дата и время окончания сессии
          const now = new Date();
          const expirationTime = new Date(now.getTime() + response.expireIn * 1000);

          // Сохраняем данные локально
          this.saveAuthData(this.token, this.userId, response.username, response.email, expirationTime);

          // Перенаправляем на главную страницу после авторизации
          this.router.navigate(['/']);
        }
      });
  }

  signup(email: string, username: string, password: string) {
    const newUser = {email, username, password};

    this.http.post<{
      message?: string,
      result?: any
    }>('http://localhost:4000/api/auth/signup', newUser)
      .subscribe(result => {
          this.router.navigate(['/']);
        },
        error1 => {
          console.log(error1);
        });
  }

  logout() {
    this.userId = null;
    this.token = null;
    this.authUser = {
      isAuth: false,
      username: '',
      email: ''
    };
    this.authStatusListner.next({
      isAuth: false,
      username: '',
      email: ''
    });
    this.removeAuthData();
    clearTimeout(this.tokenTimer);

    this.router.navigate(['/']);
  }

  update(email: string, username: string, password?: string) {
    let updatedUser;
    password ? updatedUser = {email, username, password} :
      updatedUser = {email, username};

    this.http.patch<{ email: string, username: string }>('http://localhost:4000/api/auth/update', updatedUser)
      .subscribe((updatedInfo) => {
        console.log(updatedInfo);
      });
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthUser() {
    return this.authUser;
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
    const userData = this.getUserData();

    if (!authData) {
      return;
    }

    const now = new Date();
    // Проверяем, не прошло ли время сессии пользователя
    const expireIn = authData.expirationTime.getTime() - now.getTime();

    if (expireIn > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.authUser = {
        isAuth: true,
        username: userData.username,
        email: userData.email
      };
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListner.next({
        isAuth: true,
        username: userData.username,
        email: userData.email
      });
    }
  }

  /*
  * Сохранение данных локально на машине
  * */
  private saveAuthData(token: string, userId: string, username: string, email: string, expirationTime: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('expirationTime', expirationTime.toISOString());
  }

  private removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('expirationTime');
  }

  private getUserData() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    return {username, email};
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
