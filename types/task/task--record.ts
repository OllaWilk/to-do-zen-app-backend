export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface TaskSimpleEntity {
  id?: string;
  time: Date;
  title: string;
}

export interface TaskEntity extends TaskSimpleEntity {
  category?: string;
  reminder?: boolean;
  priority: Priority;
  description?: string;
}

export type CreateTaskReq = Omit<TaskEntity, 'id' | 'date'>;
