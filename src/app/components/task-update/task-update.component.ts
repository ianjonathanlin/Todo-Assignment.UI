import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Task } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.scss'],
})
export class TaskUpdateComponent {
  modalTitle = 'Update Task';
  task!: Task;
  tasks!: Task[];
  ngbDateStruct!: NgbDateStruct;
  ngbTimeStruct!: NgbTimeStruct;

  constructor(
    private taskService: TaskService,
    public modalRef: MdbModalRef<TaskUpdateComponent>
  ) {}

  closeModal(): void {
    this.taskService.getAllTasks().subscribe((result: Task[]) => {
      this.tasks = result;
      this.modalRef.close(this.tasks);
    });
  }

  updateTaskAction(): void {
    let isoDate: Date = new Date(
      this.ngbDateStruct.year,
      this.ngbDateStruct.month - 1,
      this.ngbDateStruct.day,
      this.ngbTimeStruct.hour,
      this.ngbTimeStruct.minute,
      0 //second
    );
    this.task.dueDate = isoDate;

    this.taskService
      .updateTask(this.task.id!, this.task)
      .subscribe((result: Task[]) => {
        this.tasks = result;
        this.modalRef.close(this.tasks);
      });
  }
}
