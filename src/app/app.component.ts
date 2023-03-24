import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { GetTasksService } from './services/get-tasks.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refresh-token.service';
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
    public authService: AuthService,
    private logoutService: LogoutService,
    private refreshTokenService: RefreshTokenService
  ) {}

  ngOnInit(): void {
    if (this.authService.authStatus) {
      this.getTasksService.getLatestTasks();
    } else {
      this.toastService.show({
        message: 'Please Login or Register.',
        classname: 'bg-dark text-light',
      });
    }
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  openRegisterModal(): void {
    this.modalService.open(RegisterComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });
  }

  openLoginModal(): void {
    this.modalService.open(LoginComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });
  }

  logout(): void {
    this.logoutService.logout();
  }
}
