const express = require("express");
const logger = require("morgan");
const multer = require("multer")
const path = require("path");
const cron = require("node-cron");
const { updateStudentAge } = require("./models/studentDetail");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "dist")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
app.use("/api", require("./routes/loginsRoute"));


// Root endpoint to serve the main homepage
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html")); 
});


// Update student age at real time (for project purpose only)
const runUpdateStudentAge = async () => {
  console.log('Running updateStudentAge function');
  try {
    const updatedRows = await updateStudentAge();
    console.log(`Updated age for ${updatedRows} students.`);
  } catch (err) {
    console.error('Error updating ages:', err);
  }
  console.log('Finished updateStudentAge function');
};

runUpdateStudentAge(); // Run the update student age() 

// Update age at midnight on January 1st yearly
cron.schedule('0 0 1 1 *', runUpdateStudentAge);


// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).send('File too large. Max size is 2MB.');
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
