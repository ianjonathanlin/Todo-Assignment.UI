import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IToast } from './models/toast';
import { AuthService } from './services/auth.service';
import { GetTasksService } from './services/getTasks.service';
import { LogoutService } from './services/logout.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'To-Do Application';
  modalRef: MdbModalRef<any> | null = null;

  constructor(
    private modalService: MdbModalService,
    private toastService: ToastService,
    private getTasksService: GetTasksService,
    public authService: AuthService,
    private logoutService: LogoutService
  ) {}

  ngOnInit(): void {
    // Check if authToken is expired when initialized
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
        this.logoutService.logout(undefined);
      }
    }

    this.getTasksService.getLatestTasks();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  openRegisterModal(): void {
    this.modalRef = this.modalService.open(RegisterComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });

    this.modalRef.onClose.subscribe((toast: IToast | undefined) => {
      if (toast) {
        this.toastService.show(toast);
      }
    });
  }

  openLoginModal(): void {
    this.modalRef = this.modalService.open(LoginComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });

    this.modalRef.onClose.subscribe((toast: IToast | undefined) => {
      if (toast) {
        let token = localStorage.getItem('authToken');

        // If login success / has authToken
        if (token) {
          this.toastService.clear();
          this.toastService.show(toast);
          
          this.authService.authStatus = true;
          
          let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
          this.authService.userName = decodedJWT.userName;

          this.getTasksService.getLatestTasks();
        } else {
          this.toastService.show(toast);
        }
      }
    });
  }

  logout(): void {
    let logoutToast: IToast = {
      message: 'Logout Success.',
      classname: 'bg-success text-light',
      autohide: true,
      delay: 5000,
    };

    this.logoutService.logout(logoutToast);
    
    this.getTasksService.getLatestTasks();
  }
}
