// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Xizmat nomi kiritilishi shart'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Narx kiritilishi shart'],
    min: [0, 'Narx 0 dan kichik bo‘lmasligi kerak'],
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategoriya tanlanishi shart'],
  },
}, {
  timestamps: true, // createdAt va updatedAt maydonlarini avtomatik qo‘shadi
});

module.exports = mongoose.model('Service', serviceSchema);