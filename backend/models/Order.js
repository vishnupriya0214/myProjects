const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
