import { pool } from './db';

export async function testDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('Połączenie z bazą danych zostało nawiązane pomyślnie.');
  } catch (error) {
    console.error('Błąd podczas łączenia z bazą danych:', error);
    process.exit(1);
  }
}
