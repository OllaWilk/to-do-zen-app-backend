import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { EventPhoto } from '../types';
import { pool } from '../utils/db';

type EventPhotoResults = [EventPhoto[], FieldPacket[]];

export class EventPhotoRecord implements EventPhoto {
  public photo_id: string;
  public event_id: string;
  public photo_url: string;
  public photo_title: string;

  constructor(obj: EventPhoto) {
    const { photo_id, event_id, photo_url, photo_title } = obj;

    this.photo_id = photo_id ?? uuid();
    this.event_id = event_id;
    this.photo_url = photo_url;
    this.photo_title = photo_title;
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
}
