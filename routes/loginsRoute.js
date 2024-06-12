const express = require('express');
const router = express.Router();
const { studentSignUp, teacherSignUp, login } = require('../controllers/loginsCTRL');


router.post('/studentsignup', studentSignUp);
router.post('/teachersignup', teacherSignUp);
router.post('/login', login);


module.exports = router;