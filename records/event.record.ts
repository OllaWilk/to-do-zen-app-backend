import { FieldPacket } from 'mysql2';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { EventEntity, EventStatus } from '../types';
import { ValidationError } from '../utils/errors';
import { pool } from '../utils/db';
import { EventPhotoRecord } from './eventPhoto.record';
import { deletePhotoFromDropbox } from './dropbox';

type EventRecordResults = [EventRecord[], FieldPacket[]];

export class EventRecord implements EventEntity {
  // Defining the properties of the class
  public readonly id: string;
  public readonly created_at: Date;
  public title: string;
  public price: number | null;
  public event_date?: Date | null;
  public status: EventStatus;
  public description: string;
  public url?: string;
  public lat?: number | null;
  public lon?: number | null;
  public category: string;
  public duration?: string;
  public reminder?: number | null;
  public creator_id: string;

  // Constructor to initialize the properties
  constructor(obj: EventEntity) {
    const {
      id,
      title,
      price,
      event_date,
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

    this.id = id ?? uuid(); // Generate UUID if id is not provided
    this.created_at = new Date(); // Set current date as creation date
    this.title = title ?? ''; // Default to empty string if not provided
    this.price = price ?? 0; // Default price to 0 if not provided
    this.event_date = event_date ?? new Date(); // Set current date as event date if not provided
    this.status = status ?? 'planned'; // Default status to 'planned' if not provided
    this.description = description ?? ''; // Default to empty string if not provided
    this.url = url ?? ''; // Default url to an empty string if not provided
    this.lat = lat ?? null;
    this.lon = lon ?? null;
    this.category = category ?? ''; // Default to empty string if not provided
    this.duration = duration ?? ''; // Default to empty string if not provided
    this.reminder = reminder ?? null;
    this.creator_id = creator_id ?? ''; // Default to empty string if not provided
  }

  // Method to validate the fields
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

    if (!validator.isLength(this.title, { min: 3, max: 255 })) {
      const characters = this.title.length;
      throw new ValidationError(
        `Title must be between 3 and 255 characters. Currently, it has ${characters} characters.`
      );
    }

    if (!validator.isIn(this.status, ['planned', 'ongoing', 'completed'])) {
      throw new Error('Status must be one of: planned, ongoing, completed.');
    }
    if (!validator.isLength(this.description, { min: 2, max: 1000 })) {
      throw new Error('Description must be between 3 and 1000 characters.');
    }
  }

  // Static method to get all events by user ID,  optionally filtered by title
  static async getAll(user_id: string, title?: string): Promise<EventRecord[]> {
    let query = 'SELECT * FROM `events` WHERE 1=1';
    const params: { [key: string]: string } = {};

    if (user_id) {
      query += ' AND `creator_id` = :user_id';
      params.user_id = user_id;
    }

    if (title) {
      query += ' AND `title` LIKE :search';
      params.search = `%${title}%`;
    }

    const [results] = (await pool.execute(query, params)) as EventRecordResults;

    return results.map((obj) => new EventRecord(obj));
  }

  static async sortBy(
    user_id: string,
    column: string,
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<EventRecord[]> {
    const validColums = ['title', 'status', 'price', 'event_date'];

    if (!validColums.includes(column)) {
      throw new ValidationError(`Invalid column name: ${column}`);
    }

    if (order !== 'ASC' && order !== 'DESC') {
      throw new ValidationError(`Invalid order: ${order}`);
    }

    const query = `SELECT * FROM \`events\` WHERE \`creator_id\` = :id ORDER BY \`${column}\` ${order}`;

    const [result] = (await pool.execute(query, {
      id: user_id,
    })) as EventRecordResults;

    return result.map((obj) => new EventRecord(obj));
  }

  // Static method to get a single event by its ID
  static async getOne(id: string): Promise<EventRecord | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `events` WHERE `id` = :id',
      {
        id,
      }
    )) as EventRecordResults;

    return results.length === 0 ? null : new EventRecord(results[0]);
  }

  // Method to insert a new event into the database
  async insert(): Promise<void> {
    this.validate(); // Validate the event before insertion

    await pool.execute(
      'INSERT INTO `events` (`id`, `created_at`, `title`, `price`, `event_date`, `status`, `description`, `url`, `lat`, `lon`, `category`, `duration`, `reminder`, `creator_id`) VALUES (:id, :created_at, :title,  :price, :event_date, :status , :description , :url, :lat, :lon , :category, :duration, :reminder, :creator_id)',
      {
        id: this.id,
        created_at: this.created_at,
        title: this.title,
        price: this.price,
        event_date: this.event_date,
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

  // Method to update an existing event
  async update(
    updatedEventData: Omit<EventEntity, 'id' | 'creator_id'>
  ): Promise<void> {
    this.validate(); // Validate the event before updating
    await pool.execute(
      'UPDATE `events` SET `created_at` = :created_at, `title` = :title ,  `price` = :price, `event_date` = :event_date, `status` = :status,  `description` = :description , `url` = :url, `lat` = :lat, `lon` = :lon,  `category` = :category , `duration` = :duration , `reminder` = :reminder  WHERE `id` = :id',
      {
        id: this.id,
        creator_id: this.creator_id,
        ...updatedEventData,
      }
    );
  }

  // Method to delete an event
  async delete(): Promise<void> {
    //get all photos linked to the event
    const photos = await EventPhotoRecord.getAll(this.id);

    //delete all photos from dropbox
    for (const photo of photos) {
      await deletePhotoFromDropbox(photo.photo_id);
    }

    await pool.execute('DELETE FROM `events` WHERE `id` = :id', {
      id: this.id,
    });
  }
}
