import { FieldPacket } from 'mysql2';
import { Priority, TaskEntity } from '../types';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

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

    if (!obj.title || obj.title.length > 100) {
      throw new ValidationError(
        'Title of the task cannot be empty or exceed 100 characters.'
      );
    }

    if (!obj.priority) {
      throw new ValidationError('The priority must be selected');
    }

    if (obj.description.length > 1000) {
      throw new ValidationError(
        'The description cannot be exceed 1000 characters.'
      );
    }
  }

  static async getAll(): Promise<TaskRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `tasks`'
    )) as TaskRecordResults;

    return results.map((obj) => new TaskRecord(obj));
  }

  static async getOne(id: string): Promise<TaskRecord | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `tasks` WHERE `id` = :id',
      {
        id,
      }
    )) as TaskRecordResults;

    return results.length === 0 ? null : new TaskRecord(results[0]);
  }
}
