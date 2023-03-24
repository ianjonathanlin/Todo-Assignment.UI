export class Task {
    id?: number;
    title!: string;
    description?: string;
    dueDate!: Date;
    category!: string;
    created?: Date;
    updated?: Date;
}