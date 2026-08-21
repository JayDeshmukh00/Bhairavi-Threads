const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  design: { type: String, required: true },
  price: { type: Number, required: true },
  stockStatus: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
  images: [{ type: String }],
  videoUrl: { type: String }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  material: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  variants: [variantSchema],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);