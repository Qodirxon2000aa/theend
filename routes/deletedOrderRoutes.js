// routes/deletedOrderRoutes.js
const express = require('express');
const router = express.Router();
const DeletedOrder = require('../models/DeletedOrder');

// GET: Barcha o‘chirilgan buyurtmalarni olish
router.get('/', async (req, res) => {
  try {
    const deletedOrders = await DeletedOrder.find().populate({
      path: 'services',
      populate: { path: 'category_id', select: 'name' },
    });
    res.status(200).json(deletedOrders);
  } catch (error) {
    res.status(500).json({ message: 'O‘chirilgan buyurtmalarni olishda xatolik', error: error.message });
  }
});

// POST: O‘chirilgan buyurtma qo‘shish
router.post('/', async (req, res) => {
  try {
    const { originalOrderId, total_price, services, date, deletionReason, deletedAt } = req.body;

    // Ma'lumotlarni tekshirish
    if (!originalOrderId || !total_price || !services || !date || !deletionReason) {
      return res.status(400).json({ message: 'Barcha maydonlar to‘ldirilishi shart' });
    }

    const deletedOrder = new DeletedOrder({
      originalOrderId,
      total_price,
      services,
      date,
      deletionReason,
      deletedAt,
    });

    const savedDeletedOrder = await deletedOrder.save();
    res.status(201).json(savedDeletedOrder);
  } catch (error) {
    res.status(400).json({ message: 'O‘chirilgan buyurtma qo‘shishda xatolik', error: error.message });
  }
});

module.exports = router;