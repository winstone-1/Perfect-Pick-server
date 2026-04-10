import express from 'express'
import protect from '../middleware/protect.js'
import { adminOnly, managerOrAdmin } from '../middleware/roles.js'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers
} from '../controllers/adminController.js'

const router = express.Router()

router.use(protect)

// Admin only
router.post('/products', adminOnly, createProduct)
router.put('/products/:id', adminOnly, updateProduct)
router.delete('/products/:id', adminOnly, deleteProduct)
router.get('/users', adminOnly, getAllUsers)

// Manager or Admin
router.get('/orders', managerOrAdmin, getAllOrders)
router.put('/orders/:id', managerOrAdmin, updateOrderStatus)

export default router