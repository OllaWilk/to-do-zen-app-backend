import { FieldPacket } from 'mysql2';
import { v4 as uuid } from 'uuid';
import { EventEntity } from '../types';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type EventRecordResults = [EventRecord[], FieldPacket[]];

export class EventRecord implements EventEntity {
  public id?: string;
  public title: string;
  public created_at: Date;
  public price: number | 'free';
  public date?: Date;
  public status: 'planed' | 'ongoing' | 'completed';
  public description?: string;
  public url?: string;
  public lat?: number;
  public lon?: number;
  public category: string;
  public duration?: string;
  public reminder?: number;
  public creator_id: string;

  constructor(obj: EventEntity) {
    const {
      id,
      title,
      created_at,
      price,
      date,
      status,
      description,
      url,
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
    this.url = url;
    this.lat = lat;
    this.lon = lon;
    this.category = category;
    this.duration = duration;
    this.reminder = reminder;
    this.creator_id = creator_id;

    /* Validation */
    if (!obj.title) {
      throw new ValidationError(
        'Title of the event cannot be empty or exceed 100 characters.'
      );
    }

    if (obj.description.length > 1000) {
      throw new ValidationError(
        'The description cannot be exceed 1000 characters.'
      );
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
    await pool.execute(
      'INSERT INTO `events` (`id`, `created_at`, `title`, `price`, `date`, `status`, `description`, `url`, `lat`, `lon`, `category`, `duration`, `reminder`, `creator_id`) VALUES (:id, :created_at, :title,  :price, :date, :status , :description , :url, :lat, :lon , :category, :duration, :reminder, :creator_id)',
      {
        id: this.id,
        created_at: this.created_at,
        title: this.title,
        price: this.price,
        date: this.date,
        status: this.status,
        description: this.description,
        url: this.url,
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
    console.log(this.id, this.creator_id, this.created_at);
    await pool.execute(
      'UPDATE `events` SET `created_at` = :created_at, `title` = :title ,  `price` = :price, `date` = :date, `status` = :status,  `description` = :description ,`url` = :url, `lat` = :lat, `lon` = :lon,  `category` = :category , `duration` = :duration , `reminder` = :reminder  WHERE `id` = :id',
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
