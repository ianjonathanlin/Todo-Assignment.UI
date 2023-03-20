import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Alert } from 'src/app/models/alert';
import { Task } from 'src/app/models/task';
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
    public modalRef: MdbModalRef<TaskDeleteComponent>
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  deleteTaskAction(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.modalRef.close({
          type: 'success',
          message: 'Task deleted successfully',
        });
      },
      error: (err) => {
        this.modalRef.close({ type: 'danger', message: err.error });
      },
    });
  }
}
