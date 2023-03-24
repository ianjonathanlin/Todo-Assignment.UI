import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  modalTitle = 'Register New User';
  registerUser = new User();

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private modalRef: MdbModalRef<RegisterComponent>
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  register(): void {
    this.authService.register(this.registerUser).subscribe({
      next: () => {
        this.modalRef.close();
        
        this.toastService.show({
          message: "New user registered successfully.",
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
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
