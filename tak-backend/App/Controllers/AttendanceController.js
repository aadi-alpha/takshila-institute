// adjust path if needed

const AttendanceModel = require("../models/AttendanceModel");
const mongoose = require('mongoose')
// POST /attendance-insert
const insertAttendance = async (req, res) => {
  try {
    const attendanceArray = req.body;

    if (!Array.isArray(attendanceArray) || attendanceArray.length === 0) {
      return res.status(400).json({ message: "Attendance data is required" });
    }

    // Validate each record
    for (const record of attendanceArray) {
      const requiredFields = [
        "BranchId",
        "batchId", // Added batchId
        "month",
        "year",
        "Date",
        "StudentId",
        "Name",
        "F_NAME",
        "RollNo",
        "subject",
        "status",
      ];
      for (const field of requiredFields) {
        if (!record[field]) {
          return res
            .status(400)
            .json({ message: `Field "${field}" is required for each record` });
        }
      }
    }

    // Save all attendance records at once
    const insertedRecords = await AttendanceModel.insertMany(attendanceArray);

    res.status(201).json({
      message: "Attendance saved successfully",
      data: insertedRecords,
    });
  } catch (error) {

    res.status(500).json({ message: "Failed to save attendance", error: error.message });
  }
};



const fetchAttendance = async (req, res) => {
  try {
    const { batchId, studentId, subject, month, year } = req.query;
    const branchId = req.user.branchId

    if (!branchId || !batchId || !subject || !month || !year) {
      return res.status(400).json({
        message: "branchId, batchId, subject, month, and year are required",
      });
    }

    // Convert month name → month index
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

    // Start & end date for selected month
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    // Build query
    let query = {
      BranchId: new mongoose.Types.ObjectId(branchId),
      batchId: new mongoose.Types.ObjectId(batchId),
      subject: subject.toLowerCase(),
      Date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (studentId) {
      query.StudentId = new mongoose.Types.ObjectId(studentId);
    }

    // Fetch records
    const attendanceRecords = await AttendanceModel
      .find(query)
      .sort({ Date: 1 });

    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};
const updateAttendance = async (req, res) => {
  try {
    const branchId = req.user.branchId;
    const { studentId, date, status, subject } = req.body;

    if (!studentId || !date || !status || !subject) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!["P", "A", "L"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance status",
      });
    }

    // Normalize date
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const existingAttendance = await AttendanceModel.findOne({
      StudentId: new mongoose.Types.ObjectId(studentId),
      BranchId: new mongoose.Types.ObjectId(branchId),
      subject: subject.toLowerCase(),
      Date: { $gte: start, $lte: end },
    });

    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    existingAttendance.status = status;
    await existingAttendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: existingAttendance,
    });
  } catch (error) {
    console.error("Update Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating attendance",
    });
  }
};





module.exports = { insertAttendance, fetchAttendance, updateAttendance };
