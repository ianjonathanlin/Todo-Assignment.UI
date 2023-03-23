import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IAuthenticatedResponse } from '../models/authResponse';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private url = 'Token';

  constructor(private http: HttpClient) {}

  checkTokenExpired(): boolean {
    let authToken = localStorage.getItem('authToken');
    if (authToken) {
      let expiry = JSON.parse(window.atob(authToken.split('.')[1])).exp;
      if (Math.floor(new Date().getTime() / 1000) >= expiry) {
        return true;
      }
    }
    return false;
  }

  async tryRefreshingToken(): Promise<boolean> {
    let authToken = localStorage.getItem('authToken');
    let refreshToken = localStorage.getItem('refreshToken');
    if (!authToken || !refreshToken) {
      return false;
    }

    const credentials = JSON.stringify({
      accessToken: authToken,
      refreshToken: refreshToken,
    });

    let isRefreshSuccess: boolean = false;

    this.http
      .post<IAuthenticatedResponse>(
        `${environment.apiUrl}/${this.url}/refresh`,
        credentials,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .subscribe({
        next: (res: IAuthenticatedResponse) => {
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('refreshToken', res.refreshToken);

          authToken = localStorage.getItem('authToken');
          refreshToken = localStorage.getItem('refreshToken');
          console.log("success");
          console.log('auth', authToken);
          console.log('refresh', refreshToken);

          isRefreshSuccess = true;
        },
        error: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');

          authToken = localStorage.getItem('authToken');
          refreshToken = localStorage.getItem('refreshToken');
          
          console.log("failed");
          console.log('auth', authToken);
          console.log('refresh', refreshToken);
        },
      });

    return isRefreshSuccess;
  }
}
