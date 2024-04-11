export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum Category {
  ToDo = 'to do',
  InProgress = 'in progress',
  Done = 'done',
}
export interface TaskSimpleEntity {
  id?: string;
  time: Date;
  title: string;
}

export interface TaskEntity extends TaskSimpleEntity {
  category: Category;
  priority?: Priority;
  description?: string;
}

export type CreateTaskReq = Omit<TaskEntity, 'id' | 'time'>;
