import express from 'express'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart) return res.json({ items: [] })
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, variant, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const variantExists = product.variants.find(v => v.name === variant)
    if (!variantExists) return res.status(400).json({ message: 'Variant not found' })
    if (variantExists.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' })

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) cart = new Cart({ user: req.user._id, items: [] })

    const existingItem = cart.items.find(
      i => i.product.toString() === productId && i.variant === variant
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: productId, variant, quantity })
    }

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE /api/cart/:itemId
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId)
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router