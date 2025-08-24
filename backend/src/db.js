import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ping function to test DB
async function ping() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connected at:', res.rows[0].now);
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

// export both pool and ping
export { pool, ping };
