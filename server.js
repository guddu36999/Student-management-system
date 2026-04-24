require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: Number, required: true, unique: true },
  className: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

app.post("/add-student", async (req, res) => {
  try {
    const { name, rollNo, className } = req.body;

    const student = new Student({ name, rollNo, className });
    await student.save();

    res.json({ message: "Student Added Successfully", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/mark-attendance", async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    let record = await Attendance.findOne({ studentId, date });

    if (record) {
      record.status = status;
      await record.save();
      return res.json({ message: "Attendance Updated", record });
    }

    record = new Attendance({ studentId, date, status });
    await record.save();

    res.json({ message: "Attendance Marked Successfully", record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/attendance/:date", async (req, res) => {
  const date = req.params.date;
  const records = await Attendance.find({ date }).populate("studentId");
  res.json(records);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});