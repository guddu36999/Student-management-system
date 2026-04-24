const express = require("express");
const Student = require("../models/Student");

const router = express.Router();


router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student Added", student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

module.exports = router;