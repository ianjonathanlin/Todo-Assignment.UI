import { Component } from '@angular/core';

import { NgFor, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet, NgFor],
  template: `
    <ngb-toast
      class="text-center"
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="toast.autohide || false"
      [delay]="toast.delay || 0"
      (hidden)="toastService.remove(toast)"
    >
      <p class="" style="display: inline">
        {{ toast.message }}
      </p>
    </ngb-toast>
  `,
  host: {
    class:
      'toast-container position-fixed top-20 start-50 translate-middle-x p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainer {
  constructor(public toastService: ToastService) {}
}
