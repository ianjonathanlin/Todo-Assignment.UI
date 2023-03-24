import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { GetTasksService } from 'src/app/services/get-tasks.service';
import { ToastService } from 'src/app/services/toast.service';
import { IAuthToken } from 'src/app/models/authToken';
import { ITokens } from 'src/app/models/tokens';
import jwt_decode from 'jwt-decode';

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
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  login(): void {
    this.authService.authenticate(this.loginUser).subscribe({
      next: (response: ITokens) => {
        // set tokens to local storage
        localStorage.setItem('authToken', response.authToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // set login status and username
        let decodedJWT: IAuthToken = jwt_decode(response.authToken);
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
        this.modalRef.close();
        
        switch (err.status) {
          case 0:
            this.toastService.show({
              message: 'Server is unreachable.',
              classname: 'bg-danger text-light',
              autohide: true,
              delay: 10000,
            });
            break;
          default:
            this.toastService.show({
              message: err.error,
              classname: 'bg-danger text-light',
              autohide: true,
              delay: 10000,
            });
            break;
        }
      },
    });
  }
}
