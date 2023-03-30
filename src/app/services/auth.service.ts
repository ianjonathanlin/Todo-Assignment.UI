import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { User } from '../models/user';
import { GetTasksService } from './get-tasks.service';
import { ToastService } from './toast.service';
import { IAuthToken } from '../models/authToken';
import { ITokens } from '../models/tokens';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatus = false;
  userName = '';

  private url = 'Authentication';

  constructor(
    private http: HttpClient,
    private getTasksService: GetTasksService,
    private toastService: ToastService
  ) {
    let token = localStorage.getItem('authToken');

    if (token) {
      let decodedJWT: IAuthToken = jwt_decode(token);
      this.authStatus = true;
      this.userName = decodedJWT.userName;
    }
  }

  public register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.url}/register`, user);
  }

  public authenticate(user: User): Observable<ITokens> {
    return this.http.post<ITokens>(
      `${environment.apiUrl}/${this.url}/authenticate`,
      user
    );
  }

  public refreshToken(): Observable<ITokens> {
    const credentials: ITokens = {
      authToken: localStorage.getItem('authToken')!,
      refreshToken: localStorage.getItem('refreshToken')!,
    };

    return this.http.post<ITokens>(
      `${environment.apiUrl}/${this.url}/refresh-token`,
      credentials
    );
  }

  public checkTokenExpiry(): boolean {
    let authToken = localStorage.getItem('authToken');

    if (authToken != null) {
      let decodedJWT: IAuthToken = jwt_decode(authToken);
      let expiryDate = new Date(0);
      expiryDate.setUTCSeconds(decodedJWT.exp);

      let currentDateTime = new Date();

      if (expiryDate > currentDateTime) {
        this.authStatus = true;
        this.userName = decodedJWT.userName;
        return true;
      }
    }

    return false;
  }

  public logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // clear retrieved tasks list
    this.getTasksService.tasks = [];

    this.authStatus = false;
    this.userName = '';

    this.toastService.clear();
  }
}
