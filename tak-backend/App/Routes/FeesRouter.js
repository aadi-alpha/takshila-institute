const express = require('express')
const { insertFees, fetchFeesByStudentId, updatefeesbyid, fetchFeesRecordById } = require('../Controllers/FeesController')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')

const FeesRouter = express.Router()

FeesRouter.post('/fees-insert', authMiddlewares, allowRoles("admin", "receptionist"), insertFees)
FeesRouter.get('/fees-record-fetch', authMiddlewares, allowRoles("admin", "receptionist"), fetchFeesByStudentId)
FeesRouter.patch('/fees-update/:id', authMiddlewares, allowRoles("admin", "receptionist"), updatefeesbyid)
FeesRouter.get('/fees-by-id/:id', authMiddlewares, allowRoles("admin", "receptionist"), fetchFeesRecordById);
module.exports = { FeesRouter }