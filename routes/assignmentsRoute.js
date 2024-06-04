const express = require('express');
const router = express.Router();
const assignmentsCTRL = require('../controllers/assignmentsCTRL');


router.get('/get-all-assignments/:student_id/:drawing_resources_id', assignmentsCTRL.getAllAssignmentsForStudent);
router.get('/get-assignments/:assignment_id', assignmentsCTRL.getAssignmentsById);
router.post('/add-new-assignments', assignmentsCTRL.addNewAssignmentsForStudent);
router.put('/update-feedback/:assignment_id', assignmentsCTRL.updateFeedbackForAssignments);
router.delete('/:assignment_id', assignmentsCTRL.deleteAssignments);


module.exports = router;