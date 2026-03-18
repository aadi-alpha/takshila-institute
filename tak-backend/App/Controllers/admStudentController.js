const { RegistrationStudentModel } = require("../models/studentRegisterModel");
const { CountStudentsByBranch } = require("../utils/StudentCountByBranch");

const findStudentsBatch = async (req, res) => {
    try {
        const BranchId = req.user.branchId
        const { batch, search, paymentFilter } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        if (!batch) {
            return res.status(400).json({
                status: 0,
                message: "Batch is required"
            });
        }

        /* ---------------- DYNAMIC QUERY ---------------- */
        let query = { branchId: BranchId };

        // batch filter
        if (batch !== "all") {
            query.batchId = batch;
        }

        // payment filter
        if (paymentFilter) {

            query.st_payment_status = paymentFilter;
        }

        // search filter (regex)
        if (search) {
            query.$or = [
                { st_firstName: { $regex: search, $options: "i" } },
                { st_lastName: { $regex: search, $options: "i" } },
                { rollNo: { $regex: search, $options: "i" } }
            ];
        }

        /* ---------------- QUERY EXECUTION ---------------- */
        const [students, totalStudents] = await Promise.all([
            RegistrationStudentModel.find(query)
                .select("createdAt st_firstName st_lastName st_whatsappNo batchDetails st_class st_payment_status rollNo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            RegistrationStudentModel.countDocuments(query)
        ]);

        if (!students.length) {
            return res.status(404).json({
                status: 0,
                message: "No students found",
                studentsLength: 0
            });
        }

        res.status(200).json({
            status: 1,
            message: "Students fetched successfully",
            studentsLength: students.length,
            Students: students,
            TotalStudents: totalStudents,
            page,
            limit
        });

    } catch (error) {
        console.error("findStudentsBatch error:", error);

        res.status(500).json({
            status: 0,
            message: "Cannot fetch students",
            error: error.message
        });
    }
};
const findStudentsForTests = async (req, res) => {
    try {
        const {  batchId, subject } = req.query;
           const branchId = req.user.branchId

        const students = await RegistrationStudentModel.find({
            branchId,
            batchId,
            st_subjects: subject
        }).select(
            "st_firstName st_lastName f_name st_class st_subjects rollNo"
        );

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
const getStudentsNamesByBatch = async (req, res) => {
    try {
        const {  batchId } = req.query;
           const branchId = req.user.branchId

        if (!branchId || !batchId) {
            return res.status(400).json({
                success: false,
                message: "branchId and batchId are required",
            });
        }

        // Fetch students
        const students = await RegistrationStudentModel.find({
            branchId,
            batchId
        }).select("st_firstName st_lastName f_name rollNo"); // only select required fields

        if (!students.length) {
            return res.status(404).json({
                success: false,
                message: "No students found in this batch",
            });
        }

        res.status(200).json({
            success: true,
            count: students.length,
            students,
        });

    } catch (error) {
        console.error("getStudentsNamesByBatch error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
const fetchStudentByBranch = async (req, res) => {
    try {
        const { branchId } = req.query

        if (!branchId) {
            return res.status(404).send({
                status: 0,
                message: "Branch Id is required field"
            })
        }
        const allStudents = await RegistrationStudentModel.find({ branchId }).select("st_firstName st_lastName rollNo")
        if (!allStudents) {
            return res.status(400).send({
                status: 0,
                message: "Not able to fetch students"
            })
        }
        res.status(201).send({
            status: 1,
            message: "Fetched students of your branch",
            students: allStudents
        })
    } catch (error) {
        res.status(500).send({
            status: 0,
            message: "server side error",

        })
    }
}


module.exports = { findStudentsBatch, findStudentsForTests, getStudentsNamesByBatch, fetchStudentByBranch }