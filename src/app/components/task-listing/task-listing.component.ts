import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AuthService } from 'src/app/services/auth.service';
import { GetTasksService } from 'src/app/services/get-tasks.service';
import { Task } from '../../models/task';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskDeleteComponent } from '../task-delete/task-delete.component';
import { TaskUpdateComponent } from '../task-update/task-update.component';

@Component({
  selector: 'app-task-listing',
  templateUrl: './task-listing.component.html',
  styleUrls: ['./task-listing.component.scss'],
})
export class TaskListingComponent {
  pageTitle = 'To-do Application';
  currentDateTime = new Date();

  constructor(
    public getTasksService: GetTasksService,
    private modalService: MdbModalService,
    public authService: AuthService
  ) {}

  openAddModal(): void {
    this.modalService.open(TaskAddComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });
  }

  openUpdateModal(taskToBeUpdated: Task): void {
    let task: Task = {
      id: taskToBeUpdated.id,
      title: taskToBeUpdated.title,
      category: taskToBeUpdated.category,
      description: taskToBeUpdated.description,
      dueDate: taskToBeUpdated.dueDate,
      created: taskToBeUpdated.created,
      updated: taskToBeUpdated.updated,
    };

    let taskDueDate = new Date(taskToBeUpdated.dueDate);
    let ngbDateStruct: NgbDateStruct = {
      day: taskDueDate.getDate(),
      month: taskDueDate.getMonth() + 1,
      year: taskDueDate.getFullYear(),
    };
    let ngbTimeStruct: NgbTimeStruct = {
      hour: taskDueDate.getHours(),
      minute: taskDueDate.getMinutes(),
      second: taskDueDate.getSeconds(),
    };

    this.modalService.open(TaskUpdateComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: {
        task: task,
        ngbDateStruct: ngbDateStruct,
        ngbTimeStruct: ngbTimeStruct,
      },
    });
  }

  openDeleteModal(taskToBeDeleted: Task): void {
    this.modalService.open(TaskDeleteComponent, {
      modalClass: 'modal-dialog-centered',
      data: { task: taskToBeDeleted },
    });
  }
}
