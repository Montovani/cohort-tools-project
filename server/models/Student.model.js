const mongoose = require("mongoose")

const Schema = mongoose.Schema

const studentSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  linkedinUrl: String,
  languages: [String],
  program: String,
  background: String,
  image: String,
  projects: [String],
  cohort: String,
})

const Student = mongoose.model("Student", studentSchema)

module.exports = Student
