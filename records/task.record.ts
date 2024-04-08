import { Priority, TaskEntity } from '../types';

interface NewTaskEntity extends Omit<TaskEntity, 'id'> {
  id: string;
  time: Date;
  title: string;
  category?: string;
  reminder?: boolean;
  priority: Priority;
  description?: string;
}

export class TaskRecord implements TaskEntity {
  public id: string;
  public time: Date;
  public title: string;
  public category?: string;
  public reminder?: boolean;
  public priority: Priority;
  public description?: string;

  constructor(obj: TaskEntity) {}
}
