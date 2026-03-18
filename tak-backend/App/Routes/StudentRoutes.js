// student routes approve(payment = paid) , get studentfor student View, update student data, deleteStudent

const express = require('express')
const { approveStudents, FindStudentById, deleteStudentById, updateStudent } = require('../Controllers/studentsController')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')
const { insertStudents } = require('../Controllers/StudentRegisterController')
const studentRoutes = express.Router()
studentRoutes.post('/student-insert',authMiddlewares,allowRoles("admin","superAdmin","receptionist"), insertStudents)
studentRoutes.put('/approve-student/:id',authMiddlewares, allowRoles('admin'), approveStudents)
studentRoutes.get('/fetchById-student/:id',authMiddlewares, allowRoles('admin', "receptionist"),FindStudentById)
studentRoutes.delete('/delete-student/:id',authMiddlewares, allowRoles('admin'),deleteStudentById)
studentRoutes.put('/student-update/:id',authMiddlewares,allowRoles('admin'), updateStudent)

module.exports={studentRoutes}