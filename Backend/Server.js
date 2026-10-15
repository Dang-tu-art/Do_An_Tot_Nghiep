const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./Router/authRouter');
const orderRoutes = require('./Router/orderRouter');
const reviewRoutes = require('./Router/reviewRouter');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});