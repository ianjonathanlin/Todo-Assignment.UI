import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-delete',
  templateUrl: './task-delete.component.html',
  styleUrls: ['./task-delete.component.scss'],
})
export class TaskDeleteComponent {
  modalTitle = 'Delete Task';
  task!: Task;
  tasks!: Task[];

  constructor(
    private taskService: TaskService,
    public modalRef: MdbModalRef<TaskDeleteComponent>
  ) {}

  closeModal(): void {
    this.taskService.getAllTasks().subscribe((result: Task[]) => {
      this.tasks = result;
      this.modalRef.close(this.tasks);
    });
  }

  deleteTaskAction(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe((result: Task[]) => {
      this.tasks = result;
      this.modalRef.close(this.tasks);
    });
  }
}
