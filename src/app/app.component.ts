import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoginComponent } from './components/login/login.component';
import { Toast } from './models/toast';
import { AuthService } from './services/auth.service';
import { GetTasksService } from './services/getTasks.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'To-Do Application';
  modalRef: MdbModalRef<LoginComponent> | null = null;

  constructor(
    private modalService: MdbModalService,
    private toastService: ToastService,
    private getTasksService: GetTasksService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    //TODO: What if token is expired when user is performing action

    // Check if authToken is expired
    let token = localStorage.getItem('authToken');
    if (token) {
      let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));

      let tokenExpiryDate = new Date(0);
      tokenExpiryDate.setUTCSeconds(decodedJWT.exp);

      let current = new Date();

      if (current < tokenExpiryDate) {
        this.authService.authStatus = true;
        this.authService.userName = decodedJWT.userName;
      } else {
        localStorage.removeItem('authToken');
      }
    }

    this.getTasksService.getLatestTasks();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  openLoginModal(): void {
    this.modalRef = this.modalService.open(LoginComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });

    this.modalRef.onClose.subscribe((toast: Toast | undefined) => {
      if (toast) {
        let t = this.toastService.getToastByMessage('Please Login.');
        if (t != null) {
          this.toastService.remove(t);
        }

        this.authService.authStatus = true;
        this.toastService.show(toast);

        this.getTasksService.getLatestTasks();
      }
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authService.authStatus = false;
    this.authService.userName = '';

    this.getTasksService.getLatestTasks();
  }
}
