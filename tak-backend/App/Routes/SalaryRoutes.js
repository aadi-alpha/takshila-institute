const express = require('express')
let SalaryRouter = express.Router()
const authMiddlewares = require('../middlewares/authMiddleware')
const { InsertSalary, getSalaries, UpdateSalary, getSalaryById } = require('../Controllers/SalaryController')
const { allowRoles } = require('../middlewares/allowedRoles')


SalaryRouter.post('/insert-salary', authMiddlewares, allowRoles('admin'), InsertSalary)
SalaryRouter.get('/get-salaries', authMiddlewares, allowRoles('admin'), getSalaries)
SalaryRouter.put('/update-salary/:salaryId', authMiddlewares, allowRoles('admin'), UpdateSalary)
SalaryRouter.get("/SalaryTakshila-fetch-id/:SalaryId", authMiddlewares, allowRoles('admin'), getSalaryById);

module.exports = SalaryRouter