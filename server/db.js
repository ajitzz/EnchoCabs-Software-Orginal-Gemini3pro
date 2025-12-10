require('dotenv').config();
const { Pool } = require('pg');

// Prefer DATABASE_URL / POSTGRES_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No DATABASE_URL or POSTGRES_URL found in environment.');
  process.exit(1);
}

// Detect if it's Render (remote)
const isRemote = connectionString.includes('render.com');

const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.connect()
  .then(() => console.log('✅ Successfully connected to PostgreSQL database'))
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL.', err.message);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
