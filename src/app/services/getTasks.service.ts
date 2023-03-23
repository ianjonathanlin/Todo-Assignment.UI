import { Injectable, OnDestroy } from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from './task.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class GetTasksService implements OnDestroy {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) {}

  ngOnDestroy(): void {
    this.tasks = [];
  }

  getLatestTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (result) => {
        this.tasks = result.map((task) => {
          task.dueDate = new Date(task.dueDate);
          return task;
        });
      },
      error: (err) => {
        if (err.status == 401) {
          this.toastService.show({
            message: 'Please Login or Register.',
            classname: 'bg-dark text-light',
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
