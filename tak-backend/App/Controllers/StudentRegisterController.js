const upload = require("../../multer")
let { RegistrationStudentModel } = require("../models/studentRegisterModel")
const { RollCounterModel } = require('../utils/RollCounterSchema')

let insertImage = async (req, res) => {
  try {
    res.json({
      imageUrl: req.file.path
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}
let insertStudents = async (req, res) => {

  try {
    const studentDet = req.body;
    const student = new RegistrationStudentModel(req.body)
    const registeredData = await student.save()

    res.status(200).send({
      registeredData,
      message: "Student successfully inserted",
    })
  } catch (error) {
    res.status(400).send({
      status: 0,
      message: "failed in entering students",
      error: error.message
    })
  }
}


module.exports = { insertStudents, insertImage }