const mongoose = require('mongoose')
const { RegistrationStudentModel } = require("../models/studentRegisterModel")
const { UserTakshilaModel } = require("../models/UserTakshila")
const { FeesModel } = require('../models/FeesModel')
const { salaryModel } = require('../models/SalaryModel')

// total students , fees collection total , paid amount total ,staff total 
const countController = async (req, res) => {

    try {
        const branchId = new mongoose.Types.ObjectId(req.user.branchId)
        let totalstu = await RegistrationStudentModel.countDocuments({ branchId })

        const totalTeachers = await UserTakshilaModel.countDocuments({
            branchId,
            role: "teacher"
        })

        const totalReceptionists = await UserTakshilaModel.countDocuments({
            branchId,
            role: "receptionist"
        })
        const feesTotal = await FeesModel.aggregate([
            {
                $match: {
                    branchId,
                }
            },
            {
                $group: {
                    _id: null,
                    totalPaidFees: {
                        $sum: "$paidAmount"

                    }
                }
            }
        ])
        const paidAmountAsSalary = await salaryModel.aggregate([
            {
                $match: {
                    branchId,
                }

            },
            {
                $group: {
                    _id: null,
                    totalPaidSalary: {
                        $sum: "$paidAmount"
                    }

                }
            }
        ])

        res.status(200).send({
            message: "students found",
            countData: {
                totalStudents: totalstu || null,
                totalTeachers: totalTeachers || 0,
                totalReceptionists: totalReceptionists || 0,
                totalEarnings: (feesTotal.length > 0 ? feesTotal[0].totalPaidFees : 0),
                totalPaidAmount: (paidAmountAsSalary.length > 0 ? paidAmountAsSalary[0].totalPaidSalary : 0)
            }
        })
    } catch (error) {
        res.status(400).send({
            message: "error in fetching counts",
            status: 0
        })
    }



}
module.exports = countController