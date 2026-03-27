import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  section: { type: String, enum: ['art', 'study'], required: true },
  category: { type: String, required: true },
  rating: { type: Number },
  reviews: { type: Number }
});

export default mongoose.model('Product', productSchema);