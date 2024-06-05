const assignmentModel = require('../models/assignment');

const getAllAssignmentsForStudent = async (req, res) => {
  const { student_id } = req.params;
  
  try {
    const assignments = await assignmentModel.getAllAssignmentsByStudentId(student_id);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send('Server error');
  }
};

const getAssignmentsById = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const assignment = await assignmentModel.getAssignmentById(assignment_id);
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).send('Server error');
  }
};

const addNewAssignmentsForStudent = async (req, res) => {
  const assignment = req.body;
  
  try {
    const newAssignment = await assignmentModel.addNewAssignmentForStudent(assignment);
    res.json(newAssignment);
  } catch (error) {
    console.error('Error adding new assignment:', error);
    res.status(500).send('Server error');
  }
};

const updateFeedbackForAssignments = async (req, res) => {
  const { assignment_id } = req.params;
  const assignment = req.body;

  try {
    const updatedAssignment = await assignmentModel.updateFeedbackForAssignment(assignment_id, assignment);
    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).send('Server error');
  }
};

const deleteAssignments = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const deletedAssignment = await assignmentModel.deleteAssignment(assignment_id);
    res.json(deletedAssignment);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllAssignmentsForStudent,
  getAssignmentsById,
  addNewAssignmentsForStudent,
  updateFeedbackForAssignments,
  deleteAssignments,
};
