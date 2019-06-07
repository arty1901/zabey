import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Auth-interceptor используется для изменения/модификации любого исходящего запроса
  // В данном случае, к исходящему запросу на добавление поста добавляется новый header Authorization
  // в котором содержится токен авторизованного пользователя
  // За счет этого токена, сервер получит инф о пользователе создателе, его id и email
  // и использует это для добавления поста в БД

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = this.authService.getToken();

    const authReq = (req as HttpRequest<any>).clone({
      headers: req.headers.set('Authorization', 'Test ' + authToken)
    });

    return next.handle(authReq);
  }
}
