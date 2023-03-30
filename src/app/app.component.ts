import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { GetTasksService } from './services/get-tasks.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  pageTitle = 'To-Do Application';

  constructor(
    private modalService: MdbModalService,
    private toastService: ToastService,
    private getTasksService: GetTasksService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.checkTokenExpiry()) {
      this.toastService.show({
        message: 'Welcome Back!',
        classname: 'bg-success text-light',
        autohide: true,
        delay: 5000,
      });
      this.getTasksService.getLatestTasks();
    } else {
      this.authService.logout();
      this.toastService.show({
        message: 'Please Login or Register.',
        classname: 'bg-dark text-light',
      });
    }
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  openLoginModal(): void {
    this.modalService.open(LoginComponent, {
      modalClass: 'modal-dialog-centered',
    });
  }

  openRegisterModal(): void {
    this.modalService.open(RegisterComponent, {
      modalClass: 'modal-dialog-centered',
    });
  }

  logout() {
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
