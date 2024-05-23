import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { UserEntity } from '../types';
import { pool } from '../utils/db';

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
  public id?: string;
  public username: string;
  public email: string;
  private _password_hash: string;
  public created_at?: Date;

  constructor(obj: UserEntity) {
    const { id, username, email, password_hash } = obj;

    this.id = id ?? uuid();
    this.username = username;
    this.email = email;
    this._password_hash = password_hash;
    this.created_at = new Date();
  }

  get password_hash(): string {
    return this._password_hash;
  }

  set password_hash(value: string) {
    this._password_hash = value;
  }

  static async getAll(): Promise<UserRecord[]> {
    const [users] = (await pool.execute(
      'SELECT * FROM `users`'
    )) as UserRecordResults;

    return users.map((obj) => new UserRecord(obj));
  }

  static async getOne(email: string): Promise<UserEntity | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `users` WHERE `email` = :email',
      {
        email,
      }
    )) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  async signup(): Promise<void> {
    await pool.execute(
      'INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES (:id, :username, :email, :password_hash, :created_at)',
      {
        id: this.id,
        username: this.username,
        email: this.email,
        password_hash: this.password_hash,
        created_at: this.created_at,
      }
    );
  }
}
