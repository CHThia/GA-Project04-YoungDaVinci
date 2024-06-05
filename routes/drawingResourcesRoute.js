const express = require('express');
const multer = require('multer');
const drawingResourcesController = require('../controllers/drawingResourcesCTRL');

const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage, limits: { fileSize: 2 * 500 * 300 } }); // 2MB limit



router.get('/get-drawing-resources', drawingResourcesController.getDrawingResources);
router.get('/get-drawing-resources/:drawing_resources_id', drawingResourcesController.getDrawingResourcesById);
router.post('/create-drawing-resources', upload.single('details'), drawingResourcesController.createDrawingResources);
router.put('/update-drawing-resources/:drawing_resources_id', upload.single('details'), drawingResourcesController.updateDrawingResources);
router.delete('/delete-drawing-resources/:drawing_resources_id', drawingResourcesController.deleteDrawingResources);


module.exports = router;

