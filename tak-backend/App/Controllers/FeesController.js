const { FeesModel } = require("../models/FeesModel");


/**
 * INSERT FEES CONTROLLER
 * ----------------------
 * Adds new fees record for a student (month-wise)
 */
const insertFees = async (req, res) => {
    try {
        const {
            studentId,
            name,
            studentRollNo,
            toDate,
            fromDate,
            duration,
            paidAmount,
        } = req.body;

        const branchId = req.user?.branchId;

        /* ================= VALIDATION ================= */

        if (!studentId || !name || !studentRollNo || !branchId || !toDate || !fromDate || !duration) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        if (paidAmount && paidAmount < 0) {
            return res.status(400).json({
                success: false,
                message: "Paid amount cannot be negative",
            });
        }

        /* ================= DUPLICATE CHECK ================= */

        const alreadyExists = await FeesModel.findOne({
            studentId,
            branchId,
            fromDate,
            toDate,
        });

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Fees already added for this duration",
            });
        }

        /* ================= CREATE ================= */

        const newFees = new FeesModel({
            studentId,
            studentName: name,
            studentRollNo,
            branchId,
            fromDate,
            toDate,
            duration,
            paidAmount: Number(paidAmount) || 0,
        });

        await newFees.save();

        return res.status(201).json({
            success: true,
            message: "Fees inserted successfully",
            data: newFees,
        });

    } catch (error) {
        console.error("Insert Fees Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const fetchFeesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID is required",
            });
        }

        const feesData = await FeesModel.find({ studentId })
            .sort({ year: -1, month: 1 }); // latest year first

        if (!feesData || feesData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No fees records found for this student",
            });
        }

        return res.status(200).json({
            success: true,
            count: feesData.length,
            data: feesData,
        });
    } catch (error) {


        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const fetchFeesRecordById = async (req, res) => {
    try {
        const feesId = req.params.id;
        const feesRecord = await FeesModel.findById(feesId);
        if (!feesRecord) {
            return res.status(404).json({ success: false, message: "Fees record not found" });
        }
        return res.status(200).json({ success: true, data: feesRecord });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const updatefeesbyid = async (req, res) => {
    try {
        const feesId = req.params.id;
        const { paidAmount } = req.body;

        if (!paidAmount || paidAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid payment amount" });
        }

        // Fetch the fees record
        const feesRecord = await FeesModel.findById(feesId);
        if (!feesRecord) {
            return res.status(404).json({ success: false, message: "Fees record not found" });
        }

        const newPaidAmount = feesRecord.paidAmount + Number(paidAmount);
        if (newPaidAmount > feesRecord.totalFees) {
            return res.status(400).json({
                success: false,
                message: `Payment exceeds total fees. Maximum payable: ${feesRecord.totalFees - feesRecord.paidAmount}`
            });
        }

        // Update paidAmount and dueAmount
        feesRecord.paidAmount = newPaidAmount;
        feesRecord.dueAmount = feesRecord.totalFees - newPaidAmount;

        await feesRecord.save();

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: feesRecord
        });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
module.exports = {
    insertFees, fetchFeesByStudentId, updatefeesbyid, fetchFeesRecordById
};
