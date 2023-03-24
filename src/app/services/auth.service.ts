import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IAuthenticatedResponse } from '../models/authResponse';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatus = false;
  userName = '';

  private url = 'Authentication';

  constructor(private http: HttpClient) {
    let token = localStorage.getItem('authToken');

    if (token) {
      let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
      this.authStatus = true;
      this.userName = decodedJWT.userName;
    }
  }

  public register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.url}/register`, user);
  }

  public authenticate(user: User): Observable<IAuthenticatedResponse> {
    return this.http.post<IAuthenticatedResponse>(
      `${environment.apiUrl}/${this.url}/authenticate`,
      user
    );
  }
}
