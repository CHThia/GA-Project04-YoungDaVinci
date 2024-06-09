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
      `SELECT l.*, s.student_id 
       FROM logins l
       LEFT JOIN student_details s ON l.student_email = s.email
       WHERE l.student_email = $1 OR l.teacher_email = $1`,
      [email]
    );

    if (res.rows.length > 0) {
      const user = res.rows[0];
      user.isteacher = user.isteacher === 'true' || user.isteacher === true; // Convert to boolean
      console.log('User found in database:', user); // Add log
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  } finally {
    client.release();
  }
};

const getStudentName = async (studentId) => {
  const client = await pool.connect();
  try {
    console.log(`Executing query to fetch name for student ID: ${studentId}`); // Log query execution
    const res = await client.query('SELECT name FROM student_details WHERE student_id = $1', [studentId]);
    if (res.rows.length > 0) {
      console.log(`Query successful. Name: ${res.rows[0].name}`); // Log query success
      return res.rows[0].name;
    } else {
      console.log('No student found with given ID'); // Log no result
      throw new Error('Student not found');
    }
  } catch (error) {
    console.error('Error executing query:', error); // Log error
    throw error;
  } finally {
    client.release();
  }
};


module.exports = {
  insertStudentDetails,
  insertTeacherDetails,
  insertLogin,
  findUserByEmail,
  getStudentName
};