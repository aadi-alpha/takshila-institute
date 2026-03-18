// all routes of UserTakshila insert , login , update(forgotten password)
const express = require('express')
const { UserTakshilaRegister, UserTakshilaNavId, UserTakshilaRolebased, DeleteUserTakshila, updateUser } = require('../Controllers/UserTakshila')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')

const UserTakshilaRouter = express.Router()
UserTakshilaRouter.put('/UserTakshila-update/:id',authMiddlewares, allowRoles('admin', "superAdmin"), updateUser)
UserTakshilaRouter.post('/UserTakshila-insert',authMiddlewares, allowRoles('admin', "receptionist", "superAdmin"), UserTakshilaRegister)
UserTakshilaRouter.get('/UserTakshila-fetch-id/:id', authMiddlewares, allowRoles('admin', "receptionist", "superAdmin"), UserTakshilaNavId)
UserTakshilaRouter.get('/role-based-users', authMiddlewares, allowRoles('admin', "superAdmin"), UserTakshilaRolebased)
UserTakshilaRouter.delete('/delete-user-takshila/:id', authMiddlewares, allowRoles('admin',"superAdmin"), DeleteUserTakshila)



module.exports = { UserTakshilaRouter }