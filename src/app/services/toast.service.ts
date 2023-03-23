import { Injectable } from '@angular/core';
import { IToast } from '../models/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: IToast[] = [];

  show(toast: IToast) {
    this.toasts.push(toast);
  }

  remove(toast: IToast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
