import Product from '../models/Product.js'

// @desc    Get all products with filtering and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query
    let query = {}

    if (category) query.category = category
    if (search) query.name = { $regex: search, $options: 'i' }

    let products = Product.find(query)

    if (sort === 'price_asc') products = products.sort({ price: 1 })
    else if (sort === 'price_desc') products = products.sort({ price: -1 })
    else products = products.sort({ createdAt: -1 })

    res.json(await products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}