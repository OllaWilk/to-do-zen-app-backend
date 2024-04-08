import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'KarmapaChenno108',
  database: 'SpaceStepsApp',
  namedPlaceholders: true,
  decimalNumbers: true,
});
