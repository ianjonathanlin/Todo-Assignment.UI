import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
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
export class TaskListingComponent {
  pageTitle = 'To-do Application';
  tasks: Task[] = [];
  modalRef: MdbModalRef<TaskDeleteComponent> | null = null;

  constructor(
    private taskService: TaskService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.getLatestTasks();
  }

  openAddModal(): void {
    this.modalRef = this.modalService.open(TaskAddComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: { tasks: this.tasks },
    });

    this.modalRef.onClose.subscribe(() => {
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

    this.modalRef.onClose.subscribe((updatedTaskList: Task[]) => {
      this.getLatestTasks();
    });
  }

  openDeleteModal(taskToBeDeleted: Task): void {
    this.modalRef = this.modalService.open(TaskDeleteComponent, {
      modalClass: 'modal-dialog-centered',
      data: { task: taskToBeDeleted, tasks: this.tasks },
    });

    this.modalRef.onClose.subscribe((updatedTaskList: Task[]) => {
      this.getLatestTasks();
    });
  }

  private getLatestTasks(): void {
    this.taskService.getAllTasks().subscribe((result: Task[]) => {
      this.tasks = result;
    });
  }
}
