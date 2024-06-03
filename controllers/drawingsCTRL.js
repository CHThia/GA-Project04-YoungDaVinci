const Drawing = require('../models/drawing');

exports.getAllDrawings = async (req, res) => {
  try {
    const rows = await Drawing.getAllDrawings();
    const images = rows.map(row => {
      const base64Image = row.image.toString('base64');
      return `data:image/png;base64,${base64Image}`;
    });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
};

exports.saveDrawing = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { buffer } = req.file;

  try {
    await Drawing.saveDrawing(buffer);
    res.status(200).send('Drawing saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving drawing');
  }
};

exports.getDrawingById = async (req, res) => {
  const { id } = req.params;

  try {
    const row = await Drawing.getDrawingById(id);

    if (!row) {
      return res.status(404).send('Drawing not found');
    }

    const base64Image = row.image.toString('base64');
    res.send(`data:image/png;base64,${base64Image}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching drawing');
  }
};
