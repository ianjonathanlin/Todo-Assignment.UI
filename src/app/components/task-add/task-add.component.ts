import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { LogoutService } from 'src/app/services/logout.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss'],
})
export class TaskAddComponent {
  modalTitle = 'Add New Task';
  newTask: Task = {
    title: '',
    category: '',
    description: '',
    dueDate: new Date(),
  };
  ngbDateStruct: NgbDateStruct;
  ngbTimeStruct: NgbTimeStruct;

  constructor(
    private taskService: TaskService,
    private logoutService: LogoutService,
    private modalRef: MdbModalRef<TaskAddComponent>
  ) {
    let date = new Date();
    this.ngbDateStruct = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
    this.ngbTimeStruct = {
      hour: date.getHours() + 1,
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }

  closeModal(): void {
    this.modalRef.close();
  }

  addTaskAction(): void {
    let isoDate: Date = new Date(
      this.ngbDateStruct.year,
      this.ngbDateStruct.month - 1,
      this.ngbDateStruct.day,
      this.ngbTimeStruct.hour,
      this.ngbTimeStruct.minute,
      0 //second
    );
    this.newTask.dueDate = isoDate;

    this.taskService.addTask(this.newTask).subscribe({
      next: () => {
        this.modalRef.close({
          message: 'New task added successfully.',
          classname: 'bg-success text-light',
          autohide: true,
          delay: 5000,
        });
      },
      error: (err) => {
        if (err.status == 401) {
          this.modalRef.close({
            message: "Unauthorized access.",
            classname: 'bg-danger text-light',
            autohide: true,
            delay: 10000,
          });
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
