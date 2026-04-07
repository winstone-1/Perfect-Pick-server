import express from 'express'
import protect from '../middleware/protect.js'
import admin from '../middleware/admin.js'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers
} from '../controllers/adminController.js'

const router = express.Router()

// All admin routes are protected
router.use(protect, admin)

// Products
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

// Orders
router.get('/orders', getAllOrders)
router.put('/orders/:id', updateOrderStatus)

// Users
router.get('/users', getAllUsers)

export default router