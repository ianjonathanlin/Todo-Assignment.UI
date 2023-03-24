import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { IAuthenticatedResponse } from '../models/authResponse';
import { IToken } from '../models/token';
import { User } from '../models/user';
import { GetTasksService } from './get-tasks.service';
import { ToastService } from './toast.service';
import jwt_decode from "jwt-decode";

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

      let decodedJWT: IToken = jwt_decode(token);
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

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // clear retrieved tasks list
    this.getTasksService.tasks = [];

    this.authStatus = false;
    this.userName = '';

    this.toastService.clear();

    this.toastService.show({
      message: 'Logout Success.',
      classname: 'bg-success text-light',
      autohide: true,
      delay: 5000,
    });

    this.toastService.show({
      message: 'Please Login or Register.',
      classname: 'bg-dark text-light',
    });
  }
}
