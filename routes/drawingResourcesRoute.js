const express = require('express');
const multer = require('multer');
const drawingResourcesController = require('../controllers/drawingResourcesCTRL');
const authRole = require('../middleware/authRole');


const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage, limits: { fileSize: 2 * 500 * 300 } }); // 2MB limit



router.get('/get-drawing-resources', authRole(['teacher']), drawingResourcesController.getDrawingResources);
router.get('/get-drawing-resources/:drawing_resources_id', authRole(['teacher']), drawingResourcesController.getDrawingResourcesById);

router.post('/create-drawing-resources', upload.single('details'), authRole(['teacher']), drawingResourcesController.createDrawingResources);

router.put('/update-drawing-resources/:drawing_resources_id', upload.single('details'), authRole(['teacher']), drawingResourcesController.updateDrawingResources);

router.delete('/delete-drawing-resources/:drawing_resources_id', authRole(['teacher']), drawingResourcesController.deleteDrawingResources);


module.exports = router;

