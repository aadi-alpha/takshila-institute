const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    BranchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    batchId: {  // Added batchId
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    F_NAME: {
      type: String,
      required: true,
    },
    RollNo: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["P", "A", "L"], // Present, Absent, Leave
      required: true,
    },
  },
  { timestamps: true }
);

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = AttendanceModel;
