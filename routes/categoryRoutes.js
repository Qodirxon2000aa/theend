// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET: Barcha kategoriyalarni olish
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Kategoriyalarni olishda xatolik', error: error.message });
  }
});

// POST: Yangi kategoriya qo‘shish
router.post('/', async (req, res) => {
  try {
    const { name, printer_name, printer_ip } = req.body;

    // Ma'lumotlarni tekshirish
    if (!name || !printer_name || !printer_ip) {
      return res.status(400).json({ message: 'Barcha maydonlar to‘ldirilishi shart' });
    }

    const newCategory = new Category({
      name,
      printer_name,
      printer_ip,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Kategoriya qo‘shishda xatolik', error: error.message });
  }
});

// DELETE: Kategoriyani o‘chirish
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Kategoriya topilmadi' });
    }

    res.status(200).json({ message: 'Kategoriya muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Kategoriya o‘chirishda xatolik', error: error.message });
  }
});

module.exports = router;