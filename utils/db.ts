import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = createPool({
  host: 'localhost',
  user: 'phpmyadmin',
  password: process.env.DB_PASSWORD,
  database: 'SpaceStepsApp',
  namedPlaceholders: true,
  decimalNumbers: true,
});
