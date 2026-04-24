const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

router.post("/mark", async (req, res) => {
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

    res.json({ message: "Attendance Marked", record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/date/:date", async (req, res) => {
  const records = await Attendance.find({ date: req.params.date }).populate("studentId");
  res.json(records);
});


router.get("/student/:id", async (req, res) => {
  const records = await Attendance.find({ studentId: req.params.id });
  res.json(records);
});

module.exports = router;