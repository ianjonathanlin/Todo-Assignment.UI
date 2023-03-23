import { Injectable, OnDestroy } from '@angular/core';
import { Task } from '../models/task';
import { LogoutService } from './logout.service';
import { RefreshTokenService } from './refresh-token.service';
import { TaskService } from './task.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class GetTasksService implements OnDestroy {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private refreshTokenService: RefreshTokenService,
    private logoutService: LogoutService
  ) {}

  ngOnDestroy(): void {
    this.tasks = [];
  }

  async getLatestTasks(): Promise<void> {
    console.log("getLatestTasks")

    let authToken = localStorage.getItem('authToken');

    if (authToken) {
      if (this.refreshTokenService.checkTokenExpired()) {
        if (await (!this.refreshTokenService.tryRefreshingToken())) {
          console.log('refresh failed');
        } else {
          console.log('refresh success');
          this.getTasksAction();
        }
      } else {
        console.log('no need refresh');
        this.getTasksAction();
      }
    } else {
      this.logoutService.logout({
        message: 'Please Login or Register.',
        classname: 'bg-dark text-light',
      });
    }
  }

  private getTasksAction() {
    this.taskService.getAllTasks().subscribe({
      next: (result) => {
        this.tasks = result.map((task) => {
          task.dueDate = new Date(task.dueDate);
          return task;
        });
      },
      error: (err) => {
        if (err.status == 401) {
          this.toastService.show({
            message: 'Please Login or Register.',
            classname: 'bg-dark text-light',
          });
        } else {
          this.toastService.show({
            message: err.error,
            classname: 'bg-danger text-light',
            autohide: true,
            delay: 10000,
          });
        }
      },
    });
  }
}
