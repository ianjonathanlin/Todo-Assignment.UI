import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { LogoutService } from 'src/app/services/logout.service';
import { TaskService } from 'src/app/services/task.service';

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
    private logoutService: LogoutService,
    private modalRef: MdbModalRef<TaskDeleteComponent>
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  deleteTaskAction(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.modalRef.close({
          message: 'Task deleted successfully',
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
      },
      error: (err) => {
        if (err.status == 401) {
          this.modalRef.close();
          this.logoutService.logout(undefined);
        } else {
          this.modalRef.close({
            message: err.error,
            classname: 'bg-danger text-light',
            autohide: true,
            delay: 10000,
          });
        }
      },
    });
  }
}
