const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { insertStudentDetails, insertLogin, findUserByEmail } = require('../models/login');

const signup = async (req, res) => {
  try {
    const formData = req.body;
    
    // Check if password length is at least 3
    if (formData.password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long' });
    }
    
    formData.password = await bcrypt.hash(formData.password, 10);
    const studentId = await insertStudentDetails(formData);
    
    // Ensure the studentId is being used correctly
    if (!studentId) {
      return res.status(500).json({ error: 'Failed to create student details' });
    }
    
    await insertLogin(formData.email, formData.password, false); // Explicitly setting isTeacher to false

    res.status(201).json({ message: 'User created' });
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

    const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

    if (!user.isteacher) {
      return res.json({ token, redirect: '/AllStudents' });
    } else {
      return res.json({ token, redirect: '/StudentDashboard' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
};
