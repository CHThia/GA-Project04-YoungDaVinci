const pool = require('../db');


const getAllStudents = async () => {
  const result = await pool.query(
    `SELECT student_id, name, age, gender, education, email, 
            to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date 
     FROM student_details`
  );
  return result.rows;
};


const getAllStudentsById = async (student_id) => {
  const result = await pool.query(
    `SELECT student_id, name, age, gender, education, email, 
            to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date 
     FROM student_details 
     WHERE student_id = $1`, 
    [student_id]
  );
  return result.rows[0];
};


const addNewStudents = async (name, age, gender, education, email, password, date_of_birth) => {
  const result = await pool.query(
    `INSERT INTO student_details (name, age, gender, education, email, password, create_date, update_pw_date, date_of_birth) 
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7) 
     RETURNING student_id, name, age, gender, education, email, to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date`,
    [name, age, gender, education, email, password, date_of_birth]
  );
  return result.rows[0];
};


const updateStudentPassword = async (student_id, password) => {
  const result = await pool.query(
    `UPDATE student_details 
     SET password = $1, update_pw_date = NOW() 
     WHERE student_id = $2 
     RETURNING student_id, name, age, gender, education, email, to_char(date_of_birth, 'DD-MM-YYYY') as date_of_birth, create_date, update_pw_date`,
    [password, student_id]
  );
  return result.rows[0];
};


const updateStudentAge = async () => {
  const result = await pool.query(
    `UPDATE student_details 
     SET age = DATE_PART('year', AGE(date_of_birth))`
  );
  return result.rowCount;
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
  updateStudentAge,
  deleteStudentProfile,
};
