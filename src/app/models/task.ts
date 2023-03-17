export class Task {
    id?: number;
    title!: string;
    description!: string;
    dueDate!: Date;
    category!: string;
    isDeleted?: boolean;
    created?: Date;
    updated?: Date;
}