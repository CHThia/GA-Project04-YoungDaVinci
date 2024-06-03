const express = require("express");
const multer = require("multer");
const { getAllDrawings, saveDrawing, getDrawingById } = require("../controllers/drawingsCTRL");

const router = express.Router();

const upload = multer({
  limits: { fileSize: 5 * 1250 * 700 } // 5 MB
});

// Routes
router.get('/', getAllDrawings);
router.post('/save-drawing', upload.single('image'), saveDrawing);
router.get('/drawing/:id', getDrawingById);

module.exports = router;