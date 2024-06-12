const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { insertStudentDetails, insertTeacherDetails, insertLogin, findUserByEmail, getStudentName } = require('../models/login');


const studentSignUp = async (req, res) => {
  try {
    const formData = req.body;

    // Check if password length is at least 3
    if (formData.password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' });
    }

    formData.password = await bcrypt.hash(formData.password, 10); // Hash the password
    const studentId = await insertStudentDetails(formData);

    // Ensure studentId correct
    if (!studentId) {
      return res.status(500).json({ error: 'Failed to create student details' });
    }

    await insertLogin(formData.email, formData.password, false); // isTeacher must be false

    res.status(201).json({ message: 'Student created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const teacherSignUp = async (req, res) => {
  try {
    const formData = req.body;

    // Check if password length is at least 3
    if (formData.password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' });
    }

    formData.password = await bcrypt.hash(formData.password, 10); // Hash the password
    const teacherId = await insertTeacherDetails(formData);

    // Ensure teacherId is correct
    if (!teacherId) {
      return res.status(500).json({ error: 'Failed to create teacher details' });
    }

    await insertLogin(formData.email, formData.password, true); // isTeacher must be true

    res.status(201).json({ message: 'Teacher created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.pwd);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const role = user.isteacher ? 'teacher' : 'student';
    const token = jwt.sign({ email, role }, process.env.MARVEL_SECRET_WAR, { expiresIn: '1h' });

    console.log(`User found: ${JSON.stringify(user, null, 2)}`); // Log user details

    if (user.isteacher) {
      return res.json({ token, role, redirect: '/allstudents' });
    } else {
      console.log(`Fetching name for student ID: ${user.student_id}`);
      const studentName = await getStudentName(user.student_id);
      console.log(`Student Name fetched: ${studentName}`); 
      return res.json({ 
        token, 
        role,
        redirect: `/studentdashboard/${user.student_id}`, 
        studentId: user.student_id, 
        studentName
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  studentSignUp,
  teacherSignUp,
  login,
};