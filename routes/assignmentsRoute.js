const express = require('express');
const multer = require('multer');
const assignmentsCTRL = require('../controllers/assignmentsCTRL');

const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage, limits: { fileSize: 2 * 500 * 300 } }); // 2MB limit


router.get('/assignment-counts/:student_id', assignmentsCTRL.getAssignmentCounts);
router.get('/get-assignments/:assignment_id', assignmentsCTRL.getAssignmentsById);
router.get('/get-all-assignments/:student_id', assignmentsCTRL.getAllAssignmentsForStudent);
router.get('/get-all-assignments/:student_id/:assignment_status', assignmentsCTRL.getAssignmentsByStatus);

router.post('/add-new-assignments', upload.single('assignment_data'), assignmentsCTRL.addNewAssignmentsForStudent);

router.put('/update-feedback/:assignment_id', upload.single('assignment_data'), assignmentsCTRL.updateFeedbackForAssignments);

router.delete('/:assignment_id', assignmentsCTRL.deleteAssignments);


module.exports = router;