const { Pool } = require('pg');

require("dotenv").config()

// PostgreSQL connection settings
const pool = new Pool({
  user: process.env.DB_USERNAME, // Replace with your database username
  host: process.env.DB_HOST, // Replace with your database host
  database: process.env.DB, // Replace with your database name
  password: process.env.DB_PASSWORD, // Replace with your database password
  port: process.env.DB_PORT, // Default Port for PostgreSQL
  ssl: {
    rejectUnauthorized: false // This allows self-signed certificates
  }
});

// Check connection to DataBase
pool.connect(err => {
  if (err) {
    console.error('Failed to connect to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database');
  }
});

// Export query and connect methods for reuse
module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
