// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kategoriya nomi kiritilishi shart'],
    trim: true,
  },
  printer_name: {
    type: String,
    required: [true, 'Printer nomi kiritilishi shart'],
    trim: true,
  },
  printer_ip: {
    type: String,
    required: [true, 'Printer IP kiritilishi shart'],
    trim: true,
    match: [/^(\d{1,3}\.){3}\d{1,3}$/, 'Iltimos, to‘g‘ri IP manzil kiriting'], // IP manzil formati
  },
}, {
  timestamps: true, // createdAt va updatedAt maydonlarini avtomatik qo‘shadi
});

module.exports = mongoose.model('Category', categorySchema);