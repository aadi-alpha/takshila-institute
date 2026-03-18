const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
    {
        // ================= STUDENT INFO =================
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        studentName: {
            type: String,
            required: true,
            trim: true,
        },

        studentRollNo: {
            type: String,
            required: true,
        },

        // ================= BRANCH =================
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },

        // ================= FEES DETAILS =================


        //  fromDate: '',
        // toDate: '',
        // duration: ''
        fromDate: {
            type: Date,
            required: true
        },
        toDate: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },

        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },


    },
    { timestamps: true }
);

const FeesModel = mongoose.model("FeesTakshilaStudents", feesSchema);
module.exports = { FeesModel }
