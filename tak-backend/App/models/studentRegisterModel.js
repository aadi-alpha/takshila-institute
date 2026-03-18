let mongoose = require('mongoose')
const { RollCounterModel } = require('../utils/RollCounterSchema')
let RegistrationSchema = new mongoose.Schema({
  sessionYear: {
    type: String,

  },
  batchDetails: {
    type: String,

  },
  rollNo: {
    type: String,

  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId
  },
  centerLoc: {
    type: String,
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId
  },
  entranceTestDate: {
    type: Date
  },
  st_subjects: {
    type: [String], // ['math', 'science']

  },
  // -------- Student Details --------
  st_firstName: {
    type: String,

  },
  st_middleName: {
    type: String
  },
  st_lastName: {
    type: String,

  },
  st_DOB: {
    type: String,

  },
  st_gender: {
    type: String,


  },
  st_category: {
    type: String,

  },


  st_whatsappNo: {
    type: String,


  },
  // -------- Parents Details --------
  f_name: {
    type: String,

  },
  f_occupation: {
    type: String
  },
  f_contact: {
    type: String,

  },
  f_email: {
    type: String
  },

  m_name: {
    type: String,

  },
  m_occupation: {
    type: String
  },
  m_contact: {
    type: String
  },
  m_email: {
    type: String
  },

  // -------- Residential Address --------
  st_res_address: {
    type: String,

  },
  st_res_city: {
    type: String,

  },
  st_res_state: {
    type: String,

  },
  st_res_pin: {
    type: String,

  },

  // -------- Academic Details --------
  st_class: {
    type: String,

  },
  st_school_name: {
    type: String,

  },
  st_per_last_year: {
    type: String,

  },

  // -------- Payment Details --------
  st_payment_mode: {
    type: String,


  },
  st_payment_amount: {
    type: String

  },
  st_payment_status: {
    type: String

  },

  // -------- Declaration --------
  st_declaration: {
    type: Boolean

  },
  stuPhotoUrl: {
    type: String
  },

},
  {
    timestamps: true
  }

)
RegistrationSchema.pre('save', async function () {
  // Skip if rollNo already exists
  if (this.rollNo) return

  const counter = await RollCounterModel.findOneAndUpdate(
    { name: 'studentRoll' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )

  const branchName = this.centerLoc || 'BRCH'
  const branchCode = branchName.substring(0, 4).toUpperCase()
  const count = String(counter.seq).padStart(4, '0')

  this.rollNo = `TAK${branchCode}${count}`
})



const RegistrationStudentModel = mongoose.model('studentsTakshila', RegistrationSchema)
module.exports = { RegistrationStudentModel }