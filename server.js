const express = require('express');
const app = express();
require('dotenv').config({ quiet: true });
const ConnectDB = require("./config/connectDB");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute");
const StudentRoute = require("./routes/StudentRoute");

// Swagger setup
const swaggerSpec = require('./appSwagger');


app.use(cors());
app.use(express.json())

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(swaggerSpec);
});

// Custom Swagger UI HTML template
const swaggerHtml = require('./customUIHTML');

// Swagger UI route with custom HTML
app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml);
});


ConnectDB();

app.get("/",(req,res)=>{
    res.send("Server is Fine")
})

// Test endpoint to verify Swagger spec generation
app.get('/test-swagger', (req, res) => {
  try {
    res.json({
      message: 'Swagger spec generated successfully',
      hasSpec: !!swaggerSpec,
      specKeys: Object.keys(swaggerSpec || {}),
      pathsCount: swaggerSpec?.paths ? Object.keys(swaggerSpec.paths).length : 0
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error generating Swagger spec',
      error: error.message
    });
  }
});

app.use("/api/v0/user",UserRoute);
app.use("/api/v0/student",StudentRoute);

// For Vercel: export app instead of listen()
module.exports = app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
  });
}