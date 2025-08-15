  require('dotenv').config(); // .env faylini o‘qish uchun
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');

  // Routes
  const categoryRoutes = require('./routes/categoryRoutes');
  const serviceRoutes = require('./routes/serviceRoutes');
  const orderRoutes = require('./routes/orderRoutes');
  const deletedOrderRoutes = require('./routes/deletedOrderRoutes');
  const employeeRoutes = require('./routes/employeeRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const kassaRoutes = require('./routes/kassaRoutes');

  const app = express();
  const port = process.env.PORT || 5000;

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  }));

  // Middleware
  app.use(express.json());

  // MongoDB ulanishi
  const MONGO_URI = process.env.MONGO_URI;
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('✅ MongoDB Atlas ga ulandi'))
    .catch((err) => console.error('❌ MongoDB ulanish xatosi:', err));

  // Routerlarni ulash
  app.use('/category', categoryRoutes);
  app.use('/service', serviceRoutes);
  app.use('/order', orderRoutes);
  app.use('/deleted-orders', deletedOrderRoutes);
  app.use('/employee', employeeRoutes);
  app.use('/admin', adminRoutes);
  app.use('/kassa', kassaRoutes);

  // Static papka (rasm va fayllar uchun)
  app.use('/uploads', express.static('uploads'));

  // Serverni ishga tushirish
  app.listen(port, () => {
    console.log(`🚀 Server ${port}-portda ishlamoqda`);
  });