const express = require('express')
const authMiddlewares = require('../middlewares/authMiddleware')
const { allowRoles } = require('../middlewares/allowedRoles')
const { CreateBatch, BatchFetch, batchDelete } = require('../Controllers/BatchController')
const batchRoutes = express.Router()


batchRoutes.post('/batch-insert',authMiddlewares,allowRoles("superAdmin"), CreateBatch)
batchRoutes.get('/batch-fetch',authMiddlewares,allowRoles("admin","superAdmin","receptionist"), BatchFetch)
batchRoutes.delete('/batch-delete/:BatchId',authMiddlewares,allowRoles("superAdmin"), batchDelete)

module.exports = {batchRoutes}
