const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// data import / assignment
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api") // 127.0.0.1 same as localhost
  .then(() => {
    console.log("data base connected");
  })
  .catch((error) => {
    console.log(error);
  });

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Not used in this project.

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// data-endopoints

// *** Cohort Routes ***

// get all cohorts: 

app.get("/api/cohorts", (req, res) => {
  Cohort.find(req.query)
    .then((cohorts) => {
      console.log("Retrieved cohorts: ", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "failed to retreive cohorts" });
    });
});

// create cohort:

app.post("/api/cohorts", (req, res) => {
  console.log("received request: ");
  Cohort.create({
    inProgress: req.body.inProgress,
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours
  })
    .then(() => {
      res.send("Cohort created sucessfully");
    })
    .catch((error) => {
      console.log(error);
    });
});

// get spesific cohort by id:

app.get("/api/cohorts/:cohortId", (req, res) => {
  console.log("get request recieved (single cohort)")
  
  Cohort.find({_id: req.params.cohortId})
  .then((cohort) => {
    res.json(cohort)
  })
  .catch((error) => {
    console.log(error)
  })
  
})

// update spesific cohort by id:

app.put("/api/cohorts/:cohortId", (req, res) => {
  console.log("update req received")
  
  Cohort.findByIdAndUpdate(req.params.cohortId, {
    inProgress: req.body.inProgress,
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours
  })
  .then(() => {
    res.send(`cohort with id: ${req.params.cohortId} has updated`)
  })
  .catch((error) => {
    console.log(error)
  })
})

// delete spesific cohort by id:
app.delete("/api/cohorts/:cohortId", (req, res) => {
  console.log("delete request received")

  Cohort.findByIdAndDelete(req.params.cohortId)
  .then(() => {
    res.send(`the cohort (id: ${req.params.cohortId}) has deleted succesfully`)
  })
  .catch((error) => {
    console.log(error)
  })
})

// *** Student Routes ***

// get student: 

app.get("/api/students", (req, res) => {
  Student.find(req.query)
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students: ", students);
      res.json(students);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "failed to retreive students" });
    });
});

// create new student: 

app.post("/api/students", (req, res) => {
  console.log("received request: ");
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    projects: req.body.projects,
    cohort: req.body.cohort,
  })
    .then(() => {
      res.send("Student created sucessfully");
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  console.log(req.params.cohortId);
  Student.find({ cohort: req.params.cohortId })
    .then((students) => {
      console.log(students);
      res.json(students);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/students/:studentId", (req, res) => {
  Student.find({ _id: req.params.studentId })
    .populate("cohort")
    .then((student) => {
      res.json(student);
      res.send("success");
    })
    .catch((error) => {
      console.log(error);
    });
});

app.put("/api/students/:studentId", (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    projects: req.body.projects,
    cohort: req.body.cohort,
  })
    .then(() => {
      res.send("Document updated");
    })
    .catch((error) => {
      console.log(error);
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then(() => {
      res.send("Document deleted");
    })
    .catch((error) => {
      console.log(error);
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
