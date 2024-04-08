import { FieldPacket } from 'mysql2';
import { Priority, TaskEntity } from '../types';
import { pool } from '../utils/db';

interface NewTaskEntity extends Omit<TaskEntity, 'id'> {
  id: string;
  time: Date;
  title: string;
  category?: string;
  reminder?: boolean;
  priority: Priority;
  description?: string;
}

type TaskRecordResults = [TaskRecord[], FieldPacket[]];

export class TaskRecord implements TaskEntity {
  public id: string;
  public time: Date;
  public title: string;
  public category?: string;
  public reminder?: boolean;
  public priority: Priority;
  public description?: string;

  constructor(obj: TaskEntity) {
    this.id = obj.id;
    this.time = obj.time;
    this.title = obj.title;
    this.category = obj.category;
    this.reminder = obj.reminder;
    this.priority = obj.priority;
    this.description = obj.description;
  }

  static async getAll(): Promise<TaskRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `tasks`'
    )) as TaskRecordResults;

    return results.map((obj) => new TaskRecord(obj));
  }
}
