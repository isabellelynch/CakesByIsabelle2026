const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id:          { type: String },
  email:        { type: String, required: true, lowercase: true, trim: true },
  cake:         { type: String, ref: 'Cake', required: true },
  price:        { type: Number, required: true, min: 0 },
  status:       { type: String, enum: ['pending', 'baking', 'ready', 'delivered', 'cancelled'], default: 'pending' },
  orderDate:    { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: true }
});

module.exports = mongoose.model('Order', orderSchema);