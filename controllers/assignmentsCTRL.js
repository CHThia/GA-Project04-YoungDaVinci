const assignmentModel = require('../models/assignment');


// Helper function to ensure assignment_data is base64
const ensureBase64AssignmentData = (assignment) => {
  if (assignment && Buffer.isBuffer(assignment.assignment_data)) {
    assignment.assignment_data = assignment.assignment_data.toString('base64');
  }
  return assignment;
};

const getAssignmentsByStatus = async (req, res) => {
  const { student_id, assignment_status } = req.params;

  try {
    const assignments = await assignmentModel.getAssignmentsByStatus(student_id, assignment_status);
    const assignmentsWithBase64 = assignments.map(ensureBase64AssignmentData);

    res.json(assignmentsWithBase64);
  } catch (error) {
    console.error('Error fetching assignments by status:', error);
    res.status(500).send('Server error');
  }
};

const getAssignmentCounts = async (req, res) => {
  const { student_id } = req.params;

  try {
    const counts = await assignmentModel.getAssignmentCounts(student_id);
    res.json(counts);
  } catch (error) {
    console.error('Error fetching assignment counts:', error);
    res.status(500).send('Server error');
  }
};

const getAllAssignmentsForStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const assignments = await assignmentModel.getAllAssignmentsByStudentId(student_id);
    const assignmentsWithBase64 = assignments.map(ensureBase64AssignmentData);

    res.json(assignmentsWithBase64);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send('Server error');
  }
};

const getAssignmentsById = async (req, res) => {
  const { assignment_id } = req.params; 

  try {
    const assignment = await assignmentModel.getAssignmentById(assignment_id); 
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    const assignmentWithBase64 = ensureBase64AssignmentData(assignment);

    res.json(assignmentWithBase64);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).send('Server error');
  }
};

const addNewAssignmentsForStudent = async (req, res) => {
  const assignment = req.body;

  if (req.file) {
    assignment.assignment_data = req.file.buffer.toString('base64');
  }

  try {
    const newAssignment = await assignmentModel.addNewAssignmentForStudent(assignment);
    const newAssignmentWithBase64 = ensureBase64AssignmentData(newAssignment);

    res.json(newAssignmentWithBase64);
  } catch (error) {
    console.error('Error adding new assignment:', error);
    res.status(500).send('Server error');
  }
};

const updateFeedbackForAssignments = async (req, res) => {
  const { feedback, assignment_data, assignment_id } = req.body;

  if (!assignment_id) {
    return res.status(400).json({ error: 'assignment_id is required' });
  }

  try {
    const updatedAssignment = await assignmentModel.updateFeedbackForAssignment(assignment_id, { feedback, assignment_data });
    const updatedAssignmentWithBase64 = ensureBase64AssignmentData(updatedAssignment);

    res.json(updatedAssignmentWithBase64);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).send('Server error');
  }
};

const updateAssignment = async (req, res) => {
  const { assignment_id } = req.params;
  const { assignment_data, assignment_status } = req.body;

  try {
    const updatedAssignment = await assignmentModel.updateAssignment(assignment_id, { assignment_data, assignment_status });
    const updatedAssignmentWithBase64 = ensureBase64AssignmentData(updatedAssignment);

    res.json(updatedAssignmentWithBase64);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).send('Server error');
  }
};

const deleteAssignments = async (req, res) => {
  const { assignment_id } = req.params;

  try {
    const deletedAssignment = await assignmentModel.deleteAssignment(assignment_id);
    if (deletedAssignment.rowCount === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).send('Server error');
  }
};


module.exports = {
  getAssignmentsByStatus,
  getAssignmentCounts,
  getAllAssignmentsForStudent,
  getAssignmentsById,
  addNewAssignmentsForStudent,
  updateFeedbackForAssignments,
  updateAssignment,
  deleteAssignments,
};