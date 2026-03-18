const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    chapterName: {
      type: String,
      trim: true
    },

    testDate: {
      type: Date,
      required: true,
    },

    maxMarks: {
      type: Number,
      required: true,
    },

    marks: [
      {
        userId: { type: String, required: true },
        userName: String,
        userF_name: String,
        obtainedMarks: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);


let TestModel = mongoose.model("TestsTakshila", testSchema);
module.exports = TestModel
