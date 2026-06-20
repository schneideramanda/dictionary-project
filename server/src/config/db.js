import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in your environment variables!');
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected via PostgreSQL');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await pool.end();
};

const query = (text, params) => pool.query(text, params);

export { pool, query, connectDB, disconnectDB };
