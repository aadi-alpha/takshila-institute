// students approve(paid) , edit  , view , delete

const { RegistrationStudentModel } = require("../models/studentRegisterModel")

const approveStudents = async (req, res) => {
    try {
        let { id } = req.params

        let approvedRes = await RegistrationStudentModel.findOneAndUpdate({ _id: id }, { $set: { st_payment_status: "paid" } }, { new: true })
        if (approvedRes) {
            res.status(200).send({
                status: 1,
                message: "successfully approved",
                data: approvedRes
            })
        }
    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "can not find student",
            error
        })
    }

}

const FindStudentById = async (req, res) => {
    try {
        let { id } = req.params
        
        let StudentDataById = await RegistrationStudentModel.findOne({ _id: id })
        if (StudentDataById) {
            res.status(200).send({
                status: 1,
                message: "student exists",
                StudentDetails: StudentDataById
            })
        }
    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "Student does not exists",
            error
        })
    }
}

const deleteStudentById = async (req, res) => {
    try {
        let { id } = req.params
    let deletedStudent = await RegistrationStudentModel.deleteOne({ _id: id })
    if (deletedStudent) {
        res.status(200).send({
            status: 1,
            message: "student successfully deleted",
            data: deletedStudent
        })
    }
    } catch (error) {
          res.status(400).send({
            status: 0,
            message: "Can not delete Student",
            error
        })
    }
}
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 BLOCK fields that should never be edited
    const blockedFields = [
      "st_payment_mode",
      "st_payment_amount",
      "st_payment_status",
      "st_declaration",
      "stuPhoto",
    ];

    blockedFields.forEach((field) => delete req.body[field]);

    const updatedStudent = await RegistrationStudentModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      message: "Update failed",
      error: err.message,
    });
  }
};
module.exports = { approveStudents, FindStudentById,deleteStudentById,updateStudent }