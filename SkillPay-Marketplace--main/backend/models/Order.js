import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  qty: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true }
  },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);