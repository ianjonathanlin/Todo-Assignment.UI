import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Alert } from 'src/app/models/alert';
import { Task } from 'src/app/models/task';
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
    description: '',
    category: '',
    dueDate: new Date(),
  };
  ngbDateStruct: NgbDateStruct;
  ngbTimeStruct: NgbTimeStruct;

  constructor(
    private taskService: TaskService,
    public modalRef: MdbModalRef<TaskAddComponent>
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
          type: 'success',
          message: 'New task added successfully',
        });
      },
      error: (err) => {
        this.modalRef.close({ type: 'danger', message: err.error });
      },
    });
  }
}
