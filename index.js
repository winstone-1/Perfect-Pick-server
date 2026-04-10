import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'

import authRoutes from './src/routes/authRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'
import mpesaRoutes from './src/routes/mpesaRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [
    'https://perfect-pick.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/mpesa', mpesaRoutes)

app.get('/', (req, res) => res.json({ message: 'API running' }))

const PORT = process.env.PORT || 5000
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION:', err.stack)
})
app.listen(PORT, () => console.log(`Server running on http://localhost: ${PORT}`))