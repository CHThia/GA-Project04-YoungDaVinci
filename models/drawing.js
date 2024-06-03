const db = require("../db");

const getAllDrawings = async () => {
  const { rows } = await db.query('SELECT * FROM drawings');
  return rows;
};

const saveDrawing = async (buffer) => {
  const client = await db.connect();
  await client.query('INSERT INTO drawings (image) VALUES ($1)', [buffer]);
  client.release();
};

const getDrawingById = async (id) => {
  const client = await db.connect();
  const result = await client.query('SELECT image FROM drawings WHERE id = $1', [id]);
  client.release();
  return result.rows[0];
};

module.exports = {
  getAllDrawings,
  saveDrawing,
  getDrawingById,
};
