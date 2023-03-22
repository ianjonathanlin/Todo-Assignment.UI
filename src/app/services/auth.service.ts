import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatus = false;
  userName = "";

  private url = 'Authentication';

  constructor(private http: HttpClient) {}

  public register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${this.url}/register`, user);
  }

  public authenticate(user: User): Observable<string> {
    return this.http.post(
      `${environment.apiUrl}/${this.url}/authenticate`,
      user,
      {
        responseType: 'text',
      }
    );
  }
}
