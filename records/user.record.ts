import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { ValidationError } from '../utils/errors';

import { FieldPacket } from 'mysql2';
import { UserEntity } from '../types';
import { pool } from '../utils/db';

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
  public id?: string;
  public username?: string | null;
  public email: string;
  private _password_hash: string;
  public created_at?: Date;

  constructor(obj: UserEntity) {
    const { id, username, email, password_hash } = obj;

    this.id = id ?? uuid();
    this.username = username || null;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = new Date();
  }

  get password_hash(): string {
    return this._password_hash;
  }

  set password_hash(value: string) {
    this._password_hash = value;
  }

  private validate(passwordErrorMessage: string) {
    const missingFields = [];
    if (!this.email) missingFields.push('email');
    if (!this.password_hash) missingFields.push('password');

    if (missingFields.length > 0) {
      throw new ValidationError(
        `The following fields cannot be empty: ${missingFields.join(', ')}.`
      );
    }

    if (!validator.isEmail(this.email)) {
      throw new ValidationError('Email is not valid.');
    }

    if (
      !validator.isStrongPassword(this.password_hash, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
      })
    ) {
      throw new ValidationError(`${passwordErrorMessage}`);
    }
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
    this.validate(
      'Password not strong enough. It should contain at least one uppercase letter, one lowercase letter, one number, one special character, and be a maximum of 8 characters long.'
    );

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password_hash, salt);
    this._password_hash = hash;

    await pool.execute(
      'INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES (:id, :username, :email, :password_hash, :created_at)',
      {
        id: this.id,
        email: this.email,
        username: this.username,
        password_hash: this.password_hash,
        created_at: this.created_at,
      }
    );
  }

  static async login(email: string, password: string): Promise<UserEntity> {
    if (!email || !password) {
      throw new ValidationError(
        'The following fields cannot be empty: email, password.'
      );
    }

    const [results] = (await pool.execute(
      'SELECT * FROM `users` WHERE `email` = :email ',
      {
        email,
      }
    )) as UserRecordResults;

    if (results.length === 0) {
      throw new ValidationError('Incorrect email or password');
    }

    const user = new UserRecord(results[0]);
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      throw new ValidationError('Incorrect email or password');
    }

    return user;
  }
}
