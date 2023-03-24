import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { IAuthenticatedResponse } from 'src/app/models/authResponse';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GetTasksService } from 'src/app/services/get-tasks.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  modalTitle = 'Login User';
  loginUser = new User();

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private getTasksService: GetTasksService,
    private modalRef: MdbModalRef<LoginComponent>
  ) {
    // DELETE THIS
    this.loginUser.userName = 'ianjonathanlin';
    this.loginUser.password = '12345';
  }

  closeModal(): void {
    this.modalRef.close();
  }

  login(): void {
    this.authService.authenticate(this.loginUser).subscribe({
      next: (response: IAuthenticatedResponse) => {
        // set tokens to local storage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);

        // set login status and username
        let decodedJWT = JSON.parse(window.atob(response.token.split('.')[1]));
        this.authService.authStatus = true;
        this.authService.userName = decodedJWT.userName;

        this.modalRef.close();

        this.toastService.clear();
        this.toastService.show({
          message: 'Login Success.',
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });

        this.getTasksService.getLatestTasks();
      },
      error: (err) => {
        this.toastService.show({
          message: err.error,
          classname: 'bg-danger text-light',
          autohide: true,
          delay: 10000,
        });
      },
    });
  }
}
