import { Injectable } from '@angular/core';
import { IToast } from '../models/toast';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  logout(toast: IToast | undefined) {
    localStorage.removeItem('authToken');
    this.authService.authStatus = false;
    this.authService.userName = '';

    this.toastService.clear();
    if (toast) {
      this.toastService.show(toast);
    }
  }
}
