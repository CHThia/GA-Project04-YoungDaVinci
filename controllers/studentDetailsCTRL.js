const studentDetails = require('../models/studentDetail');

const getAllStudents = async (req, res) => {
  try {
    const students = await studentDetails.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStudentsById = async (req, res) => {
  try {
    const student = await studentDetails.getAllStudentsById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNewStudents = async (req, res) => {
  try {
    const { name, age, gender, education, email, password } = req.body;
    const newStudent = await studentDetails.addNewStudents(name, age, gender, education, email, password);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudentPasswords = async (req, res) => {
  try {
    const updatedStudent = await studentDetails.updateStudentPassword(req.params.id, req.body.password);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudentProfiles = async (req, res) => {
  try {
    await studentDetails.deleteStudentProfile(req.params.id);
    res.json({ message: 'Student Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getAllStudentsById,
  addNewStudents,
  updateStudentPasswords,
  deleteStudentProfiles
};
