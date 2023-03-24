import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ITokens } from '../models/tokens';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('register') && // exclude register request
          !req.url.includes('authenticate') && // exclude login/authenticate request
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // if logged in
      if (this.authService.authStatus) {
        return this.authService.refreshToken().pipe(
          switchMap((tokens: ITokens) => {
            localStorage.setItem('authToken', tokens.authToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);

            this.isRefreshing = false;

            // Reinsert the new authToken to Header
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${tokens.authToken}` },
            });
            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            // logout if refresh token expired
            if (error.status == '401') {
              this.toastService.show({
                message: 'Unauthorized. Please try login again.',
                classname: 'bg-danger text-light',
                autohide: true,
                delay: 10000,
              });
              this.authService.logout();
              this.toastService.show({
                message: 'Please Login or Register.',
                classname: 'bg-dark text-light',
              });
            } else {
              this.toastService.show({
                message: error.message,
                classname: 'bg-danger text-light',
                autohide: true,
                delay: 10000,
              });
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }
}
