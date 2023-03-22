import { Injectable } from '@angular/core';
import { Toast } from '../models/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
    toasts: Toast[] = [];

	show(toast: Toast) {
		this.toasts.push(toast);
	}

	getToastByMessage(message: string) {
		return this.toasts.find(t => t.message == message);
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
