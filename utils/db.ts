import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = createPool({
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namedPlaceholders: true,
  decimalNumbers: true,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});
