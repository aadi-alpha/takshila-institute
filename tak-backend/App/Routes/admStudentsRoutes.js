// routes where adminStudent both
const express = require('express')
const { findStudentsBatch, findStudentsForTests, getStudentsNamesByBatch, fetchStudentByBranch } = require('../Controllers/admStudentController')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')
let admStudentFetch = express.Router()

admStudentFetch.get('/students-batchwise',authMiddlewares,allowRoles("admin","receptionist"),findStudentsBatch)
admStudentFetch.get('/students-tests',authMiddlewares,allowRoles("admin","receptionist"),findStudentsForTests)
admStudentFetch.get('/studentsForTestdropDown',authMiddlewares,allowRoles("admin","receptionist"),getStudentsNamesByBatch)
admStudentFetch.get('/students-by-branch',authMiddlewares,allowRoles("admin","receptionist"), fetchStudentByBranch)

module.exports={admStudentFetch}