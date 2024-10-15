import { pool } from './db';

export async function testDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('Connection to the database was successfully established.');
  } catch (error) {
    console.error('Error while connecting to the database:', error);
    process.exit(1);
  }
}
