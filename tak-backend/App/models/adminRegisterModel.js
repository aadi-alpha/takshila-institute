
// admin registration model
const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    mobile: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    branch: {
        type: String
    },
},
    {
        timestamps: true
    })
const adminModel = mongoose.model('admins-Takshila', adminSchema)
module.exports = { adminModel }