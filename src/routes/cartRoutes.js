import express from 'express'
import protect from '../middleware/protect.js'
import {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  getCartSummary
} from '../controllers/cartController.js'

const router = express.Router()

// All cart routes are protected
router.use(protect)

// Main cart routes
router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart)

// Cart item routes
router.route('/:itemId')
  .delete(removeCartItem)
  .put(updateCartItemQuantity)

// Cart summary route
router.get('/summary', getCartSummary)

export default router