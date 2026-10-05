const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Kết nối CSDL MySQL (Lấy thông tin từ file .env)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '27112004',
  database: process.env.DB_NAME || 'phone_store_db',
  waitForConnections: true,
  connectionLimit: 10,
});

// 1. API Lấy danh sách sản phẩm & tồn kho
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. API Lấy danh sách đơn hàng cho trang Nhân viên
router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, u.full_name AS customer, u.phone, u.email, o.total_amount AS totalAmount, o.status, o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. API Đặt hàng mới (Trigger MySQL sẽ tự động trừ tồn kho)
router.post('/orders', async (req, res) => {
  const { customerName, email, phone, totalAmount, total_amount, items } = req.body;

  try {
    const finalTotalAmount = totalAmount || total_amount || 0;

    let [users] = await db.query('SELECT id FROM users WHERE email = ? OR phone = ?', [email, phone]);
    let userId;

    if (users.length > 0) {
      userId = users[0].id;
    } else {
      const [newUser] = await db.query(
        'INSERT INTO users (full_name, email, phone) VALUES (?, ?, ?)',
        [customerName || 'Khách hàng', email || 'khach@gmail.com', phone || '0900000000']
      );
      userId = newUser.insertId;
    }

    for (const item of items) {
      const productId = item.id || item.product_id;

      const [rows] = await db.query('SELECT stock, name FROM products WHERE id = ?', [productId]);
      
      if (!rows.length || rows[0].stock < item.quantity) {
        return res.status(400).json({ 
          message: `Sản phẩm ${rows[0]?.name || ''} (ID: ${productId}) không đủ hàng trong kho!` 
        });
      }
    }

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, finalTotalAmount, 'Đang xử lý']
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      const productId = item.id || item.product_id;
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, productId, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: 'Đặt hàng thành công!', orderId });
  } catch (error) {
    console.error('Lỗi Backend Đặt Hàng:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. API Hủy đơn hàng (Trigger trg_after_order_cancel tự động cộng trả kho)
router.put('/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['Đã hủy', id]);
    res.json({ message: 'Hủy đơn hàng thành công và đã hoàn lại kho!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. API Xóa hoàn toàn đơn hàng khỏi CSDL MySQL (Dành cho trang Nhân viên)
router.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM order_items WHERE order_id = ?', [id]);
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Xóa đơn hàng vĩnh viễn thành công khỏi CSDL!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa!' });
    }
  } catch (error) {
    console.error('Lỗi Backend Xóa Đơn Hàng:', error);
    res.status(500).json({ error: error.message });
  }
});
// 6. API Cập nhật trạng thái đơn hàng (Dành cho Nhân viên)
router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status gửi lên: 'Đã giao'

  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status || 'Đã giao', id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Cập nhật trạng thái đơn hàng thành công!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;