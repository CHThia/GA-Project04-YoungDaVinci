const express = require('express');
const router = express.Router();
const studentDetailsCTRL = require('../controllers/studentDetailsCTRL');


router.get('/get-all-students', studentDetailsCTRL.getAllStudents);
router.get('/get-all-students/:student_id', studentDetailsCTRL.getAllStudentsById);
router.post('/add-new-students', studentDetailsCTRL.addNewStudents);
router.put('/update-student-passwords/:student_id', studentDetailsCTRL.updateStudentPasswords);
router.delete('/delete-student-profiles/:student_id', studentDetailsCTRL.deleteStudentProfiles);


module.exports = router;
