const express = require('express');
const router = express.Router();
const studentDetailsCTRL = require('../controllers/studentDetailsCTRL');
const authRole = require('../middleware/authRole');


router.get('/get-all-students', authRole(['teacher']), studentDetailsCTRL.getAllStudents);
router.get('/get-all-students/:student_id', authRole(['teacher']), studentDetailsCTRL.getAllStudentsById);

router.post('/add-new-students', authRole(['teacher']), studentDetailsCTRL.addNewStudents);

router.put('/update-student-passwords/:student_id', authRole(['teacher']), studentDetailsCTRL.updateStudentPasswords);

router.delete('/delete-student-profiles/:student_id', authRole(['teacher']), studentDetailsCTRL.deleteStudentProfiles);


module.exports = router;
