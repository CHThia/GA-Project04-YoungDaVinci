const bcrypt = require('bcrypt');
const pool = require('./db'); // Adjust the path as necessary to your db.js file

const hashPasswords = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT login_id, pwd FROM logins');
    for (let row of result.rows) {
      if (!row.pwd.startsWith('$2b$')) { // Check if the password is not hashed
        const hashedPassword = await bcrypt.hash(row.pwd, 10);
        await client.query('UPDATE logins SET pwd = $1 WHERE login_id = $2', [hashedPassword, row.login_id]);
      }
    }
    console.log('Passwords hashed successfully');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  } finally {
    client.release();
  }
};

hashPasswords();
