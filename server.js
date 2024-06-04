const express = require("express");
const logger = require("morgan");
const multer = require("multer")
// const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "dist")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
// app.use("/api/drawings", require("./routes/drawingsRoute")); // Example Reference
app.use("/api", require("./routes/drawingResourcesRoute"));
app.use("/api", require("./routes/studentDetailsRoute"));
app.use("/api", require("./routes/assignmentsRoute"));


// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).send('File too large. Max size is 5MB.');
    }
    return res.status(400).send(`Multer error: ${err.message}`);
  } else if (err) {
    console.error(err.stack);
    return res.status(500).send('An unexpected error occurred.');
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
