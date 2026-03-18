const express =  require('express')
const authMiddlewares = require('../middlewares/authMiddleware')
const { insertAttendance, fetchAttendance, updateAttendance } = require('../Controllers/AttendanceController')
const { allowRoles } = require('../middlewares/allowedRoles')
let AttendanceRouter=express.Router()

AttendanceRouter.post('/attendance-insert',authMiddlewares,allowRoles("admin","receptionist"), insertAttendance)
AttendanceRouter.get('/attendance-fetch',authMiddlewares,allowRoles("admin","receptionist"),  fetchAttendance)
AttendanceRouter.put('/attendance-update',authMiddlewares,allowRoles("admin","receptionist"),updateAttendance)
module.exports={AttendanceRouter}