const pool = require('../db');


const getAllAssignmentsForStudent = async (student_id, drawing_resources_id) => {
  const result = await pool.query(
    'SELECT * FROM assignments WHERE student_id = $1 AND drawing_resources_id = $2',
    [student_id, drawing_resources_id]
  );
  return result.rows;
};

//* For Teacher to select artwork of student_id and display on canvas
const getAssignmentById = async (assignment_id) => {
  const result = await pool.query(
    'SELECT * FROM assignments WHERE assignment_id = $1',
    [assignment_id]
  );
  return result.rows[0];
};

const addNewAssignmentForStudent = async (assignment) => {
  const result = await pool.query(
    `INSERT INTO assignments (student_id, drawing_resources_id, assignment_data, assignment_status, feedback, create_date, update_date)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [
      assignment.student_id,
      assignment.drawing_resources_id,
      assignment.assignment_data,
      'new',
      '',
    ]
  );
  return result.rows[0];
};

const updateFeedbackForAssignment = async (assignment_id, assignment) => {
  const result = await pool.query(
    `UPDATE assignments
     SET student_id = $1, drawing_resources_id = $2, assignment_data = $3, assignment_status = $4, feedback = $5, update_date = NOW()
     WHERE assignment_id = $6 RETURNING *`,
    [
      assignment.student_id,
      assignment.drawing_resources_id,
      assignment.assignment_data,
      assignment.assignment_status,
      assignment.feedback,
      assignment_id
    ]
  );
  return result.rows[0];
};

const deleteAssignment = async (assignment_id) => {
  const result = await pool.query(
    'DELETE FROM assignments WHERE assignment_id = $1 RETURNING *',
    [assignment_id]
  );
  return result.rows[0];
};

module.exports = {
  getAllAssignmentsForStudent,
  getAssignmentById,
  addNewAssignmentForStudent,
  updateFeedbackForAssignment,
  deleteAssignment
};
