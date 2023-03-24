import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GetTasksService } from './get-tasks.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private getTasksService: GetTasksService
  ) {}

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    // clear retrieved tasks list
    this.getTasksService.tasks = [];

    this.authService.authStatus = false;
    this.authService.userName = '';

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
