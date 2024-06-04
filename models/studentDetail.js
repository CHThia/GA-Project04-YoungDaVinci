const pool = require('../db');

const getAllStudents = async () => {
  const result = await pool.query('SELECT * FROM student_details');
  return result.rows;
};

const getAllStudentsById = async (student_id) => {
  const result = await pool.query('SELECT * FROM student_details WHERE student_id = $1', [student_id]);
  return result.rows[0];
};

const addNewStudents = async (name, age, gender, education, email, password) => {
  const result = await pool.query(
    'INSERT INTO student_details (name, age, gender, education, email, password, create_date, update_pw_date) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
    [name, age, gender, education, email, password]
  );
  return result.rows[0];
};

const updateStudentPassword = async (student_id, password) => {
  const result = await pool.query(
    'UPDATE student_details SET password = $1, update_pw_date = NOW() WHERE student_id = $2 RETURNING *',
    [password, student_id]
  );
  return result.rows[0];
};

const deleteStudentProfile = async (student_id) => {
  await pool.query('DELETE FROM student_details WHERE student_id = $1', [student_id]);
  return { message: 'Student Profile deleted successfully.' };
};

module.exports = {
  getAllStudents,
  getAllStudentsById,
  addNewStudents,
  updateStudentPassword,
  deleteStudentProfile
};
