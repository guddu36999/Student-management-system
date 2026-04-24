const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: { type: String, required: true }, 
  status: { type: String, enum: ["Present", "Absent"], required: true }
});

module.exports = mongoose.model("Attendance", attendanceSchema);