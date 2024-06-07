const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/loginsCTRL');

router.post('/studentsignup', signup);
router.post('/login', login);

module.exports = router;
