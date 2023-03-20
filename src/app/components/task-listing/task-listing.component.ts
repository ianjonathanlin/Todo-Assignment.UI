import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/models/alert';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskDeleteComponent } from '../task-delete/task-delete.component';
import { TaskUpdateComponent } from '../task-update/task-update.component';

@Component({
  selector: 'app-task-listing',
  templateUrl: './task-listing.component.html',
  styleUrls: ['./task-listing.component.scss'],
})
export class TaskListingComponent implements OnInit, OnDestroy {
  pageTitle = 'To-do Application';
  tasks: Task[] = [];
  alerts: Alert[] = [];
  modalRef: MdbModalRef<TaskDeleteComponent> | null = null;
  sub!: Subscription;

  constructor(
    private taskService: TaskService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.getLatestTasks();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe;
  }

  openAddModal(): void {
    this.modalRef = this.modalService.open(TaskAddComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: { tasks: this.tasks },
    });

    this.modalRef.onClose.subscribe((alert: Alert) => {
      if (alert != undefined) {
        this.alerts.unshift(alert);
      }
      this.getLatestTasks();
    });
  }

  openUpdateModal(taskToBeUpdated: Task): void {
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
        task: taskToBeUpdated,
        ngbDateStruct: ngbDateStruct,
        ngbTimeStruct: ngbTimeStruct,
        tasks: this.tasks,
      },
    });

    this.modalRef.onClose.subscribe((alert: Alert) => {
      if (alert != undefined) {
        this.alerts.unshift(alert);
      }
      this.getLatestTasks();
    });
  }

  openDeleteModal(taskToBeDeleted: Task): void {
    this.modalRef = this.modalService.open(TaskDeleteComponent, {
      modalClass: 'modal-dialog-centered',
      data: { task: taskToBeDeleted, tasks: this.tasks },
    });
    
    this.modalRef.onClose.subscribe((alert: Alert) => {
      if (alert != undefined) {
        this.alerts.unshift(alert);
      }
      this.getLatestTasks();
    });
  }

  private getLatestTasks(): void {
    this.sub = this.taskService.getAllTasks().subscribe({
      next: (result) => (this.tasks = result),
      error: (err) => {
        this.alerts.unshift({ type: 'danger', message: err.error });
      },
    });
  }

  closeAlert(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
