try {
  process.loadEnvFile()
} catch (error){
  console.log("can't access to .env file")
}

const mongoose = require("./db")
const express = require("express");

const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// data import / assignment

const app = express();

// Midlleware Routes:

const config = require("./config")
config(app)

// *** Routes ***

// Initialization:
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");

});

// Routes of Collections:
const indexRouter = require("./routes/index.routes")  
app.use("/api", indexRouter)


// Start Server:
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
