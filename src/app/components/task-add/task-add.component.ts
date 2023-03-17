import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
})
export class TaskAddComponent {
  modalTitle = 'Delete Task';
  newTask: Task = new Task;
  tasks!: Task[];

  constructor(
    private taskService: TaskService,
    public modalRef: MdbModalRef<TaskAddComponent>
  ) {}

  closeModal(): void {
    this.taskService.getAllTasks().subscribe((result: Task[]) => {
      this.tasks = result;
      this.modalRef.close(this.tasks);
    });
  }

  addTaskAction(): void {
    // this.taskService.addTask(this.newTask).subscribe((result: Task[]) => {
    //   this.tasks = result;
    //   this.modalRef.close(this.tasks);
    // });
    this.closeModal();
  }
}
