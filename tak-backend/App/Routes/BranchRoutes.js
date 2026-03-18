const express =require('express')
const { BranchCreation, AllBranchesGet, GetBranchById, UpdateBranchById } = require('../Controllers/BranchController')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')
const countController = require('../Controllers/TotalCountsController')

const BranchDetailsFetch = express.Router()


BranchDetailsFetch.get('/data-count-fetch',authMiddlewares,allowRoles("admin") ,countController)
BranchDetailsFetch.get('/branch-fetch',authMiddlewares,allowRoles("admin","superAdmin","receptionist"), AllBranchesGet)
BranchDetailsFetch.post('/branch-insert',authMiddlewares, allowRoles("superAdmin"), BranchCreation)
BranchDetailsFetch.put('/update-branch/:id',authMiddlewares, allowRoles("superAdmin"),UpdateBranchById)
BranchDetailsFetch.get('/branch-get-ById/:id',authMiddlewares, allowRoles("superAdmin","admin","receptionist"), GetBranchById)


module.exports={BranchDetailsFetch}