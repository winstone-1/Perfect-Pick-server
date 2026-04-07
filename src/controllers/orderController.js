import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    let totalPrice = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = item.product
      const variant = product.variants.find(v => v.name === item.variant)
      
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} - ${item.variant}` })
      }

      variant.stock -= item.quantity
      await product.save()

      totalPrice += product.price * item.quantity
      orderItems.push({
        product: product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
    })

    // Clear cart after order
    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image price')
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}