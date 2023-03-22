import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-task-delete',
  templateUrl: './task-delete.component.html',
  styleUrls: ['./task-delete.component.scss'],
})
export class TaskDeleteComponent {
  modalTitle = 'Delete Task';
  task!: Task;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private modalRef: MdbModalRef<TaskDeleteComponent>
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  deleteTaskAction(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.modalRef.close({
          id: this.toastService.toasts.length + 1,
          message: 'Task deleted successfully',
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
      },
      error: (err) => {
        if (err.status == 401) {
          let t = this.toastService.getToastByMessage('Please Login.');
          if (t == undefined) {
            this.toastService.show({
              id: this.toastService.toasts.length + 1,
              message: 'Please Login.',
              classname: 'bg-dark text-light',
            });
          }
        } else {
          this.modalRef.close({
            id: this.toastService.toasts.length + 1,
            message: err.error,
            classname: 'bg-danger text-light',
            autohide: true,
            delay: 10000,
          });
        }
        this.modalRef.close();
      },
    });
  }
}
