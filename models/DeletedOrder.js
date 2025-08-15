// models/DeletedOrder.js
const mongoose = require('mongoose');

const deletedOrderSchema = new mongoose.Schema({
  originalOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Asl buyurtma ID si kiritilishi shart'],
  },
  total_price: {
    type: Number,
    required: [true, 'Umumiy narx kiritilishi shart'],
    min: [0, 'Narx 0 dan kichik bo‘lmasligi kerak'],
  },
  services: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  }],
  date: {
    type: Date,
    required: [true, 'Buyurtma sanasi kiritilishi shart'],
  },
  deletionReason: {
    type: String,
    required: [true, 'O‘chirish sababi kiritilishi shart'],
    trim: true,
  },
  deletedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('DeletedOrder', deletedOrderSchema);