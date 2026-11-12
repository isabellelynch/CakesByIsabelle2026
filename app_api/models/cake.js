const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  _id:   { type: String },
  name:  { type: String, required: true, trim: true },
  desc:  { type: String, trim: true },
  price: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Cake', cakeSchema);