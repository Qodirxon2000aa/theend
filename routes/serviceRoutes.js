// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Category = require('../models/Category');

// GET: Barcha xizmatlarni olish
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('category_id', 'name'); // Kategoriya nomini olish uchun populate
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Xizmatlarni olishda xatolik', error: error.message });
  }
});

// POST: Yangi xizmat qo‘shish
router.post('/', async (req, res) => {
  try {
    const { name, price, category_id } = req.body;

    // Ma'lumotlarni tekshirish
    if (!name || !price || !category_id) {
      return res.status(400).json({ message: 'Barcha maydonlar to‘ldirilishi shart' });
    }

    // Kategoriya mavjudligini tekshirish
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Kategoriya topilmadi' });
    }

    const newService = new Service({
      name,
      price,
      category_id,
    });

    const savedService = await newService.save();
    const populatedService = await Service.findById(savedService._id).populate('category_id', 'name');

    res.status(201).json(populatedService);
  } catch (error) {
    res.status(400).json({ message: 'Xizmat qo‘shishda xatolik', error: error.message });
  }
});

// DELETE: Xizmatni o‘chirish
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Xizmat topilmadi' });
    }

    res.status(200).json({ message: 'Xizmat muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Xizmat o‘chirishda xatolik', error: error.message });
  }
});

module.exports = router;