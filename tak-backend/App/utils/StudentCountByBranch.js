const { RegistrationStudentModel } = require("../models/studentRegisterModel")

const CountStudentsByBranch = async (branchId) => {
    try {
        if (!branchId) {
            throw new Error('Branch ID is required');
        }
        let totalStudents = await RegistrationStudentModel.countDocuments({
            branchId: branchId
        })
        return totalStudents
    } catch (error) {
        return error
    }

}
module.exports={CountStudentsByBranch}