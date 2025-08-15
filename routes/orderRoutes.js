// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const DeletedOrder = require('../models/DeletedOrder');
const Service = require('../models/Service');

// ========================
// GET: Barcha buyurtmalar
// ========================
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: 'services',
      populate: { path: 'category_id', select: 'name' },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Buyurtmalarni olishda xatolik', error: error.message });
  }
});

// ========================
// POST: Yangi buyurtma yaratish
// ========================
router.post('/', async (req, res) => {
  try {
    const { services, total_price, date } = req.body;

    // Validate services
    if (!services || services.length === 0) {
      return res.status(400).json({ message: 'Xizmatlar kiritilishi shart' });
    }

    // Validate total_price
    if (!total_price && total_price !== 0) {
      return res.status(400).json({ message: 'Jami narx kiritilishi shart' });
    }

    // Validate each service
    for (const service of services) {
      if (!service._id || !service.name || !service.price || !service.category_id) {
        return res.status(400).json({
          message: 'Each service must have _id, name, price, and category_id',
          service
        });
      }
    }

    // Create order
    const order = new Order({
      services,
      total_price,
      date: date || new Date()
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error); // Log error for debugging
    res.status(500).json({
      message: 'Buyurtma yaratishda xatolik',
      error: error.message,
      validationErrors: error.errors ? Object.values(error.errors).map(err => err.message) : []
    });
  }
});

// ========================
// DELETE: Buyurtmani o‘chirish
// ========================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'O‘chirish sababi kiritilishi shart' });
    }

    const order = await Order.findById(id).populate({
      path: 'services',
      populate: { path: 'category_id', select: 'name' },
    });

    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    // Buyurtmani o‘chirish
    await Order.findByIdAndDelete(id);

    // O‘chirilgan buyurtmani arxivga saqlash
    const deletedOrderData = {
      originalOrderId: order._id,
      total_price: order.total_price,
      services: order.services,
      date: order.date,
      deletionReason: reason.trim(),
      deletedAt: new Date(),
    };

    const deletedOrder = new DeletedOrder(deletedOrderData);
    await deletedOrder.save();

    res.status(200).json({ message: 'Buyurtma muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Buyurtma o‘chirishda xatolik', error: error.message });
  }
});

module.exports = router;