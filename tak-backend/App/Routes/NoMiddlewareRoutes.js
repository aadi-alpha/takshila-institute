// all routes of UserTakshila insert , login , update(forgotten password)
const express = require('express')
const { UserTakshilaLogin } = require('../Controllers/UserTakshila')
const {CreateBatch , BatchFetch}=require('../Controllers/BatchController')
const { AllBranchesGet } = require('../Controllers/BranchController')
const { insertStudents } = require('../Controllers/StudentRegisterController')
const countController = require('../Controllers/TotalCountsController')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')
const { TestReport } = require('../Controllers/ReportsController')



const NoMiddleWareRoutes = express.Router()


NoMiddleWareRoutes.post('/UserTakshila-fetch-login', UserTakshilaLogin)
NoMiddleWareRoutes.get('/student--test-report/:StudentId',TestReport)

module.exports = { NoMiddleWareRoutes }
