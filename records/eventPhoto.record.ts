import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { EventPhoto } from '../types';
import validator from 'validator';
import { pool } from '../utils/db';
import { ValidationError } from '../utils/errors';

type EventPhotoResults = [EventPhoto[], FieldPacket[]];

export class EventPhotoRecord implements EventPhoto {
  public photo_id: string;
  public event_id: string;
  public photo_url: string;
  public photo_title: string;
  public photo_description: string | null;

  constructor(obj: EventPhoto) {
    const { photo_id, event_id, photo_url, photo_title, photo_description } =
      obj;

    this.photo_id = photo_id ?? uuid();
    this.event_id = event_id;
    this.photo_url = photo_url;
    this.photo_title = photo_title;
    this.photo_description = photo_description;

    this.validate();
  }

  private validate() {
    const missingFields = [];

    if (!this.event_id) missingFields.push('event_id');
    if (!this.photo_url) missingFields.push('photo_url');

    if (missingFields.length > 0) {
      throw new ValidationError(
        `The following fields cannot be empty: ${missingFields.join(', ')}.`
      );
    }

    if (!validator.isLength(this.photo_title, { min: 0, max: 100 })) {
      const characters = this.photo_title.length;
      throw new ValidationError(
        `Photo title must be between 3 and 255 characters. Currently, it has ${characters} characters.`
      );
    }

    if (
      this.photo_description &&
      !validator.isLength(this.photo_description, { min: 0, max: 250 })
    ) {
      throw new ValidationError(
        'Photo description must be between 2 and 1000 characters.'
      );
    }
  }

  static async getAll(event_id: string): Promise<EventPhoto[]> {
    const [photos] = (await pool.execute(
      'SELECT * FROM `photos` WHERE `event_id` = :event_id',
      {
        event_id,
      }
    )) as EventPhotoResults;

    return photos.map((obj) => new EventPhotoRecord(obj));
  }

  static async getOne(photo_id: string): Promise<EventPhotoRecord | null> {
    const [result] = (await pool.execute(
      'SELECT * FROM `photos` WHERE `photo_id` = :photo_id',
      {
        photo_id: photo_id,
      }
    )) as EventPhotoResults;

    return result.length === 0 ? null : new EventPhotoRecord(result[0]);
  }

  async insert(): Promise<void> {
    await pool.execute(
      'INSERT INTO `photos` (`photo_id`, `event_id`, `photo_url`, `photo_title`, `photo_description`) VALUES (:photo_id, :event_id, :photo_url,  :photo_title, :photo_description)',
      {
        photo_id: this.photo_id,
        event_id: this.event_id,
        photo_url: this.photo_url,
        photo_title: this.photo_title,
        photo_description: this.photo_description,
      }
    );
    return;
  }

  async delete(): Promise<void> {
    await pool.execute(' DELETE FROM `photos` WHERE `photo_id` = :photo_id', {
      photo_id: this.photo_id,
    });
  }

  static async validateMaxPhotos(
    event_id: Pick<EventPhoto, 'event_id'>
  ): Promise<void> {
    const photo = await this.getAll(event_id + '');

    if (photo.length >= 5) {
      throw new ValidationError('An event can have a maximum of 5 photos');
    }
  }
}
