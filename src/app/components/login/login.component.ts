import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
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
      next: (token: string) => {
        localStorage.setItem('authToken', token);

        let decodedJWT = JSON.parse(window.atob(token.split('.')[1]));
        
        this.authService.userName = decodedJWT.userName;

        this.modalRef.close({
          id: this.toastService.toasts.length + 1,
          message: "Login Success.",
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
      },
      error: (err) => {
        this.modalRef.close({
          id: this.toastService.toasts.length + 1,
          message: err.error,
          classname: 'bg-danger text-light',
          autohide: true,
          delay: 10000,
        });
      },
    });
  }
}
