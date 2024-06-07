const pool = require('../db');

const insertStudentDetails = async (formData) => {
  const client = await pool.connect();
  try {
    const { name, dob, gender, education, email, password } = formData;
    const createDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const res = await client.query(
      'INSERT INTO student_details (name, date_of_birth, gender, education, email, password, create_date, update_pw_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING student_id',
      [name, dob, gender, education, email, password, createDate, createDate]
    );
    return res.rows[0].student_id;
  } finally {
    client.release();
  }
};

const insertTeacherDetails = async (formData) => {
  const client = await pool.connect();
  try {
    const { name, email, password } = formData;
    const createDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const res = await client.query(
      'INSERT INTO teacher_details (name, email, password, create_date, update_pw_date) VALUES ($1, $2, $3, $4, $5) RETURNING teacher_id',
      [name, email, password, createDate, createDate]
    );
    return res.rows[0].teacher_id;
  } finally {
    client.release();
  }
};

const insertLogin = async (email, password, isTeacher = false) => {
  const client = await pool.connect();
  try {
    const createDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const res = await client.query(
      'INSERT INTO logins (student_email, teacher_email, pwd, isteacher, create_date) VALUES ($1, $2, $3, $4, $5) RETURNING login_id',
      [isTeacher ? null : email, isTeacher ? email : null, password, isTeacher, createDate]
    );
    return res.rows[0].login_id;
  } finally {
    client.release();
  }
};

const findUserByEmail = async (email) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT * FROM logins WHERE student_email = $1 OR teacher_email = $1',
      [email]
    );
    if (res.rows.length > 0) {
      const user = res.rows[0];
      user.isteacher = user.isteacher === 'true' || user.isteacher === true; // Convert to boolean
      return user;
    } else {
      return null;
    }
  } finally {
    client.release();
  }
};


module.exports = {
  insertStudentDetails,
  insertTeacherDetails,
  insertLogin,
  findUserByEmail,
};