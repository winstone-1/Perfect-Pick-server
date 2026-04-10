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
// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (req.body.name) user.name = req.body.name

    if (req.body.newPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword)
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' })
      user.password = req.body.newPassword
    }

    await user.save()
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router