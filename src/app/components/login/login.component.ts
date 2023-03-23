import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { IAuthenticatedResponse } from 'src/app/models/authResponse';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

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
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        this.modalRef.close({
          message: "Login Success.",
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
      },
      error: (err) => {
        this.modalRef.close({
          message: err.error,
          classname: 'bg-danger text-light',
          autohide: true,
          delay: 10000,
        });
      },
    });
  }
}
