const pool = require('../db');

const getAssignmentsByStatus = async (student_id, assignment_status) => {
  try {
    const result = await pool.query(
      'SELECT * FROM assignments WHERE student_id = $1 AND assignment_status = $2',
      [student_id, assignment_status]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching assignments by status:', error);
    throw error;
  }
};

const getAssignmentCounts = async (student_id) => {
  try {
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN assignment_status = 'new' THEN 1 ELSE 0 END) AS new,
        SUM(CASE WHEN assignment_status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN assignment_status = 'completed' THEN 1 ELSE 0 END) AS completed,
        COUNT(*) AS all
      FROM assignments
      WHERE student_id = $1`,
      [student_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching assignment counts:', error);
    throw error;
  }
};

const getAllAssignmentsByStudentId = async (student_id) => {
  try {
    const result = await pool.query(
      `SELECT a.*, d.title, d.description 
       FROM assignments a
       INNER JOIN drawing_resources d ON a.drawing_resources_id = d.drawing_resources_id
       WHERE a.student_id = $1`,
      [student_id]
    );
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

const getAssignmentById = async (assignmentId) => {
  try {
    const result = await pool.query('SELECT * FROM assignments WHERE assignment_id = $1', [assignmentId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching assignment by ID:', error);
    throw error;
  }
};

const addNewAssignmentForStudent = async (assignment) => {
  try {
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
  } catch (error) {
    console.error('Error adding new assignment:', error);
    throw error;
  }
};

const updateFeedbackForAssignment = async (assignment_id, assignment) => {
  if (!assignment_id) {
    throw new Error('assignment_id is required');
  }

  if (!assignment.feedback || !assignment.assignment_data) {
    throw new Error('Feedback and assignment_data are required');
  }

  try {
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
  } catch (error) {
    console.error('Error updating feedback for assignment:', error);
    throw error;
  }
};

const updateAssignment = async (assignmentId, { assignment_data, assignment_status }) => {
  try {
    const result = await pool.query(
      'UPDATE assignments SET assignment_data = $1, assignment_status = $2, update_date = NOW() WHERE assignment_id = $3 RETURNING *',
      [assignment_data, assignment_status, assignmentId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

const deleteAssignment = async (assignment_id) => {
  try {
    await pool.query('DELETE FROM assignments WHERE assignment_id = $1', [assignment_id]);
    return { message: 'Assignment deleted successfully.' };
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
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
