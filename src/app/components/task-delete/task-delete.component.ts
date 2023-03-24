import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { GetTasksService } from 'src/app/services/get-tasks.service';
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
    private getTasksService: GetTasksService,
    private modalRef: MdbModalRef<TaskDeleteComponent>
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  deleteTaskAction(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.modalRef.close();

        this.toastService.show({
          message: 'Task deleted successfully',
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
