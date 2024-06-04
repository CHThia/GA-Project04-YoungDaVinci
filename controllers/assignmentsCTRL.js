const assignmentModel = require('../models/assignment');


const getAllAssignmentsForStudent = async (req, res) => {
  try {
    const { student_id, drawing_resources_id } = req.params;
    const assignments = await assignmentModel.getAllAssignmentsForStudent(student_id, drawing_resources_id);
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAssignmentsById = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const assignment = await assignmentModel.getAssignmentById(assignment_id);
    res.status(200).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addNewAssignmentsForStudent = async (req, res) => {
  try {
    const newAssignment = await assignmentModel.addNewAssignmentForStudent(req.body);
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFeedbackForAssignments = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const updatedAssignment = await assignmentModel.updateFeedbackForAssignment(assignment_id, req.body);
    res.status(200).json(updatedAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAssignments = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const deletedAssignment = await assignmentModel.deleteAssignment(assignment_id);
    res.status(200).json(deletedAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAssignmentsForStudent,
  getAssignmentsById,
  addNewAssignmentsForStudent,
  updateFeedbackForAssignments,
  deleteAssignments
};
