
const mongoose = require('mongoose')
const SalarySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        branchId: {
            type: mongoose.Schema.Types.ObjectId,

            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,

            required: true
        },
        month: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            default: () => new Date().getFullYear(),
        },

        role: {
            type: String,
            required: true,
            enum: ["teacher", "receptionist"]
        },

        totalSalary: {
            type: Number,
            required: true
        },

        paidAmount: {
            type: Number,
            default: 0
        },

        dueAmount: {
            type: Number,
            default: function () {
                return this.totalSalary - this.paidAmount;
            }
        }

    },
    {
        timestamps: true
    });
const salaryModel = mongoose.model("StaffSalary-Takshila", SalarySchema)
module.exports = { salaryModel }