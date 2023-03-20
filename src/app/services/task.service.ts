import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url = 'Task';

  constructor(private http: HttpClient) {}

  public getAllTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${environment.apiUrl}/${this.url}`);
  }

  public addTask(task: Task): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/${this.url}`, task);
  }

  public updateTask(taskId: number, task: Task): Observable<any> {
    return this.http
      .put(`${environment.apiUrl}/${this.url}/${taskId}`, task);
  }

  public deleteTask(taskId: number): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}/${this.url}/${taskId}`);
  }
}
