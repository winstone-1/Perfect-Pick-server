import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart) return res.json({ items: [] })
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/cart
export const addToCart = async (req, res) => {
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
}

// DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId)
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/cart/:itemId
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      })
    }
    
    const cart = await Cart.findOne({ user: req.user._id })
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }
    
    const cartItem = cart.items.find(i => i._id.toString() === req.params.itemId)
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }
    
    const product = await Product.findById(cartItem.product)
    const variant = product.variants.find(v => v.name === cartItem.variant)
    
    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available in stock`
      })
    }
    
    cartItem.quantity = quantity
    await cart.save()
    await cart.populate('items.product')
    
    res.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }
    
    cart.items = []
    await cart.save()
    
    res.json({
      success: true,
      data: { items: [] },
      message: 'Cart cleared successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// GET /api/cart/summary
export const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
    
    if (!cart || cart.items.length === 0) {
      return res.json({
        success: true,
        data: {
          totalItems: 0,
          subtotal: 0,
          items: []
        }
      })
    }
    
    let totalItems = 0
    let subtotal = 0
    
    cart.items.forEach(item => {
      totalItems += item.quantity
      const price = item.product.price
      subtotal += price * item.quantity
    })
    
    res.json({
      success: true,
      data: {
        totalItems,
        subtotal,
        items: cart.items
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}