import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { GetTasksService } from 'src/app/services/get-tasks.service';
import { TaskService } from 'src/app/services/task.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.scss'],
})
export class TaskUpdateComponent {
  modalTitle = 'Update Task';
  task!: Task;
  ngbDateStruct!: NgbDateStruct;
  ngbTimeStruct!: NgbTimeStruct;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private getTasksService: GetTasksService,
    private modalRef: MdbModalRef<TaskUpdateComponent>
  ) {}

  closeModal(): void {
    this.modalRef.close();
  }

  updateTaskAction(): void {
    let isoDate: Date = new Date(
      this.ngbDateStruct.year,
      this.ngbDateStruct.month - 1,
      this.ngbDateStruct.day,
      this.ngbTimeStruct.hour,
      this.ngbTimeStruct.minute,
      0 //ngbTimeStruct.second
    );
    this.task.dueDate = isoDate;

    this.taskService.updateTask(this.task.id!, this.task).subscribe({
      next: () => {
        this.modalRef.close();

        this.toastService.show({
          message: 'Task updated successfully.',
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
        
        this.getTasksService.getLatestTasks();
      },
      error: (err) => {
        if (err.status == 401) {
          this.toastService.show({
            message: 'Unauthorized. Please try login again.',
            classname: 'bg-dark text-light',
            autohide: true,
            delay: 10000,
          });
        } else {
          this.toastService.show({
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
