const express = require('express');
const router = express.Router();
const db = require('../Config/db');

// API lưu đánh giá sản phẩm
router.post('/', async (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;

  // Lấy giá trị an toàn nếu thiếu
  const pId = product_id || 1;
  const uId = user_id || 1;
  const rStars = rating || 5;

  try {
    await db.execute(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [pId, uId, rStars, comment || '']
    );
    return res.status(201).json({ success: true, message: 'Đánh giá thành công!' });
  } catch (error) {
    console.error('Lỗi khi lưu vào MySQL:', error);
    return res.status(500).json({ message: 'Lỗi CSDL: ' + error.message });
  }
});

module.exports = router;