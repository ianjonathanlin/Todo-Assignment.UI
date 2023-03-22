import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Toast } from 'src/app/models/toast';
import { AuthService } from 'src/app/services/auth.service';
import { GetTasksService } from 'src/app/services/getTasks.service';
import { ToastService } from 'src/app/services/toast.service';
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
  modalRef: MdbModalRef<any> | null = null;
  currentDateTime = new Date();

  constructor(
    public getTasksService: GetTasksService,
    private toastService: ToastService,
    private modalService: MdbModalService,
    public authService: AuthService
  ) {
    
  }

  openAddModal(): void {
    this.modalRef = this.modalService.open(TaskAddComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
    });

    this.modalRef.onClose.subscribe((toast: Toast | undefined) => {
      if (toast) {
        this.toastService.show(toast);
      }
      this.getTasksService.getLatestTasks();
    });
  }

  openUpdateModal(taskToBeUpdated: Task): void {

    let task: Task = {
      id: taskToBeUpdated.id,
      title: taskToBeUpdated.title,
      category: taskToBeUpdated.category,
      description: taskToBeUpdated.description,
      dueDate: taskToBeUpdated.dueDate,
      isDeleted: taskToBeUpdated.isDeleted,
      created: taskToBeUpdated.created,
      updated: taskToBeUpdated.updated
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

    this.modalRef = this.modalService.open(TaskUpdateComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: {
        task: task,
        ngbDateStruct: ngbDateStruct,
        ngbTimeStruct: ngbTimeStruct,
      },
    });

    this.modalRef.onClose.subscribe((toast: Toast | undefined) => {
      if (toast) {
        this.toastService.show(toast);
      }
      this.getTasksService.getLatestTasks();
    });
  }

  openDeleteModal(taskToBeDeleted: Task): void {
    this.modalRef = this.modalService.open(TaskDeleteComponent, {
      modalClass: 'modal-dialog-centered',
      data: { task: taskToBeDeleted },
    });

    this.modalRef.onClose.subscribe((toast: Toast | undefined) => {
      if (toast) {
        this.toastService.show(toast);
      }
      this.getTasksService.getLatestTasks();
    });
  }
}
