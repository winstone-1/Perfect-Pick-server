import express from 'express'
import protect from '../middleware/protect.js'
import {
  register,
  login,
  getProfile
} from '../controllers/authController.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/profile', protect, getProfile)

export default router