const pool = require('../db');


const getAssignmentsByStatus = async (studentId, assignment_status) => {
  const result = await pool.query(
    'SELECT * FROM assignments WHERE student_id = $1 AND assignment_status = $2',
    [studentId, assignment_status]
  );
  return result.rows;
};

const getAssignmentCounts = async (studentId) => {
  const result = await pool.query(
    `SELECT 
      SUM(CASE WHEN assignment_status = 'new' THEN 1 ELSE 0 END) AS new,
      SUM(CASE WHEN assignment_status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN assignment_status = 'completed' THEN 1 ELSE 0 END) AS completed
    FROM assignments
    WHERE student_id = $1`,
    [studentId]
  );
  return result.rows[0];
};

const getAllAssignmentsByStudentId = async (student_id) => {
  const result = await pool.query(
    'SELECT * FROM assignments WHERE student_id = $1',
    [student_id]
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
  if (!assignment_id) {
    throw new Error('assignment_id is required');
  }

  if (!assignment.feedback || !assignment.assignment_data) {
    throw new Error('Feedback and assignment_data are required');
  }

  const result = await pool.query(
    `UPDATE assignments
     SET assignment_data = $1, assignment_status = $2, feedback = $3, update_date = NOW()
     WHERE assignment_id = $4 RETURNING *`,
    [
      assignment.assignment_data,
      'completed',
      assignment.feedback,
      assignment_id
    ]
  );
  return result.rows[0];
};

const updateAssignment = async (assignmentId, { assignment_data, assignment_status }) => {
  const result = await pool.query(
    'UPDATE assignments SET assignment_data = $1, assignment_status = $2, update_date = NOW() WHERE assignment_id = $3 RETURNING *',
    [assignment_data, assignment_status, assignmentId]
  );
  return result.rows[0];
};

const deleteAssignment = async (assignment_id) => {
  await pool.query('DELETE FROM assignments WHERE assignment_id = $1', [assignment_id]);
  return { message: 'Assignment deleted successfully.' };
};


module.exports = {
  getAssignmentsByStatus,
  getAssignmentCounts,
  getAllAssignmentsByStudentId,
  getAssignmentById,
  addNewAssignmentForStudent,
  updateFeedbackForAssignment,
  updateAssignment,
  deleteAssignment
};