import { FieldPacket } from 'mysql2';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { ValidationError } from '../utils/errors';
import { EventEntity } from '../types';
import { pool } from '../utils/db';

type EventRecordResults = [EventRecord[], FieldPacket[]];

export class EventRecord implements EventEntity {
  public id: string;
  public title: string;
  public created_at: Date;
  public price?: number | null;
  public date?: Date | null;
  public status: 'planed' | 'ongoing' | 'completed';
  public description: string;
  public lat?: number | null;
  public lon?: number | null;
  public category: string;
  public duration?: string;
  public reminder?: number | null;
  public creator_id: string;

  constructor(obj: EventEntity) {
    const {
      id,
      title,
      price,
      date,
      status,
      description,
      lat,
      lon,
      category,
      duration,
      reminder,
      creator_id,
    } = obj;

    this.id = id ?? uuid();
    this.title = title;
    this.created_at = new Date();
    this.price = price ?? 0;
    this.date = date ?? new Date();
    this.status = status;
    this.description = description;
    this.lat = lat;
    this.lon = lon;
    this.category = category;
    this.duration = duration;
    this.reminder = reminder;
    this.creator_id = creator_id;
  }

  private validate() {
    const missingFields = [];
    if (!this.title) missingFields.push('title');
    if (!this.status) missingFields.push('status');
    if (!this.category) missingFields.push('category');
    if (!this.description) missingFields.push('description');
    if (!this.duration) missingFields.push('duration');

    if (missingFields.length > 0) {
      throw new ValidationError(
        `The following fields cannot be empty: ${missingFields.join(', ')}.`
      );
    }

    if (!validator.isLength(this.title, { min: 2, max: 255 })) {
      const characters = this.title.length;
      throw new ValidationError(
        `Title must be between 3 and 100 characters. Now you have ${characters} characters`
      );
    }

    if (this.date && !validator.isISO8601(this.date.toString())) {
      throw new ValidationError('Date must be a valid ISO8601 date string.');
    }

    if (!validator.isIn(this.status, ['planed', 'ongoing', 'completed'])) {
      throw new Error('Status must be one of: planed, ongoing, completed.');
    }
    if (!validator.isLength(this.description, { min: 2, max: 1000 })) {
      throw new Error('Description must be between 3 and 1000 characters.');
    }
  }

  static async getAll(): Promise<EventRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `events`'
    )) as EventRecordResults;

    return results.map((obj) => new EventRecord(obj));
  }

  static async getOne(id: string): Promise<EventRecord | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `events` WHERE `id` = :id',
      {
        id,
      }
    )) as EventRecordResults;

    return results.length === 0 ? null : new EventRecord(results[0]);
  }

  async insert(): Promise<void> {
    this.validate();

    await pool.execute(
      'INSERT INTO `events` (`id`, `created_at`, `title`, `price`, `date`, `status`, `description`, `lat`, `lon`, `category`, `duration`, `reminder`, `creator_id`) VALUES (:id, :created_at, :title,  :price, :date, :status , :description , :lat, :lon , :category, :duration, :reminder, :creator_id)',
      {
        id: this.id,
        created_at: this.created_at,
        title: this.title,
        price: this.price,
        date: this.date,
        status: this.status,
        description: this.description,
        lat: this.lat,
        lon: this.lon,
        category: this.category,
        duration: this.duration,
        reminder: this.reminder,
        creator_id: this.creator_id,
      }
    );
  }

  async update(
    updatedEventData: Omit<EventEntity, 'id' | 'creator_id'>
  ): Promise<void> {
    this.validate();
    await pool.execute(
      'UPDATE `events` SET `created_at` = :created_at, `title` = :title ,  `price` = :price, `date` = :date, `status` = :status,  `description` = :description , `lat` = :lat, `lon` = :lon,  `category` = :category , `duration` = :duration , `reminder` = :reminder  WHERE `id` = :id',
      {
        id: this.id,
        creator_id: this.creator_id,
        ...updatedEventData,
      }
    );
  }

  async delete(): Promise<void> {
    await pool.execute(' DELETE FROM `events` WHERE `id` = :id', {
      id: this.id,
    });
  }
}
