
//student register model
const express = require('express')

const { insertStudents,insertImage } = require('../Controllers/StudentRegisterController')
const upload = require('../../multer')

let StudentRegisterRouter = express.Router()
StudentRegisterRouter.post('/image-upload',upload.single("photo"),insertImage)

module.exports = { StudentRegisterRouter }