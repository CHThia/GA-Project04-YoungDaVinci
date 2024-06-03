const pool = require("../db");

const getDrawingResource = async () => {
  const result = await pool.query('SELECT * FROM drawing_resources');
  return result.rows;
};

const getDrawingResourceById = async (drawing_resources_id) => {
  const result = await pool.query('SELECT * FROM drawing_resources WHERE drawing_resources_id = $1', [drawing_resources_id]);
  return result.rows[0];
};

const createDrawingResource = async (title, description, details) => {
  const result = await pool.query(
    'INSERT INTO drawing_resources (title, description, details, create_date, update_date) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
    [title, description, details]
  );
  return result.rows[0];
};

const updateDrawingResource = async (drawing_resources_id, title, description, details) => {
  const result = await pool.query(
    'UPDATE drawing_resources SET title = $1, description = $2, details = $3, update_date = NOW() WHERE drawing_resources_id = $4 RETURNING *',
    [title, description, details, drawing_resources_id]
  );
  return result.rows[0];
};

const deleteDrawingResource = async (drawing_resources_id) => {
  await pool.query('DELETE FROM drawing_resources WHERE drawing_resources_id = $1', [drawing_resources_id]);
  return { message: 'Drawing resource deleted successfully.' };
};

module.exports = {
  getDrawingResource,
  getDrawingResourceById,
  createDrawingResource,
  updateDrawingResource,
  deleteDrawingResource
};
