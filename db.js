const { Pool } = require('pg');

require("dotenv").config()


// PostgreSQL connection settings
const pool = new Pool({
  user: process.env.DB_USERNAME, 
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, 
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  },
  connectionTimeoutMillis: 5000, // Timeout after 5 secs
  idleTimeoutMillis: 10000, // Close idle clients after 10 secs
  max: 10 // Set pool max 
});


// Check connection to DataBase
pool.connect(err => {
  if (err) {
    console.error('Failed to connect to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database');
  }
});


// Enhanced error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});


// Export query and connect methods for reuse
module.exports = {
  query: (text, params) => pool.query(text, params).catch(err => {
    console.error('Query error:', err.stack);
    throw err;
  }),
  connect: () => pool.connect().catch(err => {
    console.error('Connection error:', err.stack);
    throw err;
  }),
};
