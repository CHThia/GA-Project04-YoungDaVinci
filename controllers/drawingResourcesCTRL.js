const drawingResourceModel = require('../models/drawingResource');

const getDrawingResources = async (req, res) => {
  try {
    const rows = await drawingResourceModel.getDrawingResource();
    const images = rows.map(row => {
      const base64Image = row.details ? row.details.toString('base64') : '';
      return { ...row, details: base64Image };
    });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection error' });
  }
};

const getDrawingResourcesById = async (req, res) => {
  const { drawing_resources_id } = req.params;
  try {
    const drawingResource = await drawingResourceModel.getDrawingResourceById(drawing_resources_id);
    if (drawingResource) {
      const base64Image = drawingResource.details ? drawingResource.details.toString('base64') : '';
      res.json({ ...drawingResource, details: base64Image });
    } else {
      res.status(404).json({ error: 'Drawing Resource not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching drawing resource' });
  }
};

const createDrawingResources = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { title, description } = req.body;
  const details = req.file.buffer;

  try {
    const drawingResource = await drawingResourceModel.createDrawingResource(title, description, details);
    res.status(200).json(drawingResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving drawing resources' });
  }
};

const updateDrawingResources = async (req, res) => {
  const { drawing_resources_id } = req.params;
  const { title, description } = req.body;
  const details = req.file ? req.file.buffer : null;

  try {
    const drawingResource = await drawingResourceModel.updateDrawingResource(drawing_resources_id, title, description, details);
    res.status(200).json(drawingResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating drawing resources' });
  }
};

const deleteDrawingResources = async (req, res) => {
  const { drawing_resources_id } = req.params;
  try {
    const result = await drawingResourceModel.deleteDrawingResource(drawing_resources_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Drawing resource not found' });
    }
    res.status(200).json({ message: 'Drawing resource deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting drawing resources' });
  }
};

module.exports = {
  getDrawingResources,
  getDrawingResourcesById,
  createDrawingResources,
  updateDrawingResources,
  deleteDrawingResources
};