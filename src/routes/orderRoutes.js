import express from 'express'
import protect from '../middleware/protect.js'
import {
  createOrder,
  getMyOrders,
  getOrderById
} from '../controllers/orderController.js'

const router = express.Router()

// Protected routes
router.post('/', protect, createOrder)
router.get('/myorders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

export default router