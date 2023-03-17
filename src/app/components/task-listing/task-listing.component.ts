import { Component } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskAddComponent } from '../task-add/task-add.component';
import { TaskDeleteComponent } from '../task-delete/task-delete.component';

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
    this.taskService.getAllTasks().subscribe((result: Task[]) => {
      this.tasks = result;
    });
  }

  openAddModal(): void {
    this.modalRef = this.modalService.open(TaskAddComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: { tasks: this.tasks },
    });

    this.modalRef.onClose.subscribe((updatedTaskList: Task[]) => {
      this.tasks = updatedTaskList;
    });
  }

  openDeleteModal(taskToBeDeleted: Task): void {
    this.modalRef = this.modalService.open(TaskDeleteComponent, {
      modalClass: 'modal-dialog-centered',
      data: { task: taskToBeDeleted , tasks: this.tasks },
    });

    this.modalRef.onClose.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }
}
