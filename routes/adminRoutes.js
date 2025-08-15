const express = require('express');
const multer = require('multer');
const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');
const router = express.Router();


// Multer sozlamasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/**
 * POST /admin – Admin qo‘shish
 */
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { firstName, lastName, login, password } = req.body;
    if (!firstName || !lastName || !login || !password) {
      return res.status(400).json({ error: 'Barcha maydonlar to‘ldirilishi shart!' });
    }

    // Login unique bo‘lishi kerak
    const existingAdmin = await Admin.findOne({ login });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Bu login allaqachon mavjud!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      login,
      password: hashedPassword,
      photo: req.file ? req.file.filename : null
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin muvaffaqiyatli qo‘shildi', admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * GET /admin – Barcha adminlarni olish
 */
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * GET /admin/:id – Bitta adminni olish
 */
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin topilmadi' });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * PUT /admin/:id – Adminni yangilash
 */
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { firstName, lastName, login, password } = req.body;
    const updateData = { firstName, lastName, login };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedAdmin) return res.status(404).json({ error: 'Admin topilmadi' });

    res.json({ message: 'Admin yangilandi', admin: updatedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * DELETE /admin/:id – Adminni o‘chirish
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ error: 'Admin topilmadi' });
    res.json({ message: 'Admin o‘chirildi', admin: deletedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

module.exports = router;

/**
 * POST /admin/login – Admin tizimga kirishi
 */
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Login va parol kiritilishi shart!' });
    }

    const admin = await Admin.findOne({ login });
    if (!admin) {
      return res.status(401).json({ error: 'Login yoki parol noto‘g‘ri!' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Login yoki parol noto‘g‘ri!' });
    }

    res.json({ message: 'Tizimga kirish muvaffaqiyatli', admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server xatosi' });
  }
});
