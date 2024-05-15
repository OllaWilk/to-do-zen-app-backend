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
export interface EventSimpleEntity {
  id?: string;
  time: Date;
  title: string;
}

export interface EventEntity extends EventSimpleEntity {
  category: Category;
  priority?: Priority;
  description?: string;
}

export type CreateEventReq = Omit<EventEntity, 'id' | 'time'>;
