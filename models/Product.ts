import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Seeds', 'Fertilizer', 'Pesticides'] },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
