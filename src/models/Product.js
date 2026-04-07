import mongoose from 'mongoose'

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['bags', 'shoes', 'jewelry', 'gifts'] 
  },
  image: { type: String },
  variants: [variantSchema],
}, { timestamps: true })

export default mongoose.model('Product', productSchema)