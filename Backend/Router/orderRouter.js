const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Kết nối CSDL MySQL (Lấy thông tin từ file .env)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '27112004',
  database: process.env.DB_NAME || 'phone_store_db',
  waitForConnections: true,
  connectionLimit: 10,
});

// ==========================================
// 1. QUẢN LÝ SẢN PHẨM (CRUD PRODUCTS)
// ==========================================

// 1.1 Lấy danh sách sản phẩm & tồn kho
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1.2 Thêm sản phẩm mới (Dành cho Admin)
router.post('/products', async (req, res) => {
  const { name, brand, category, price, stock, image } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, brand, category, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, brand || 'Apple', category || 'Điện thoại', price, stock || 10, image]
    );
    res.status(201).json({ message: 'Thêm sản phẩm mới thành công!', id: result.insertId });
  } catch (error) {
    console.error('Lỗi Backend Thêm Sản Phẩm:', error);
    res.status(500).json({ error: error.message });
  }
});

// 1.3 Cập nhật / Sửa thông tin & giá sản phẩm (Dành cho Admin)
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, brand, category, price, stock, image } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, brand = ?, category = ?, price = ?, stock = ?, image = ? WHERE id = ?',
      [name, brand, category, price, stock, image, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Cập nhật sản phẩm thành công!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }
  } catch (error) {
    console.error('Lỗi Backend Sửa Sản Phẩm:', error);
    res.status(500).json({ error: error.message });
  }
});

// 1.4 Xóa vĩnh viễn sản phẩm khỏi CSDL (Dành cho Admin)
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Xóa sản phẩm khỏi CSDL thành công!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa!' });
    }
  } catch (error) {
    console.error('Lỗi Backend Xóa Sản Phẩm:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. QUẢN LÝ ĐƠN HÀNG (ORDERS)
// ==========================================

// 2.1 API Lấy danh sách đơn hàng
router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.id, u.full_name AS customer, u.phone, u.email, o.total_amount AS totalAmount, o.status, o.created_at, o.is_reviewed
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2.2 API Đặt hàng mới (Trigger MySQL tự động trừ tồn kho)
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

// 2.3 API Hủy đơn hàng (Trigger tự động cộng trả lại kho)
router.put('/orders/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['Đã hủy', id]);
    res.json({ message: 'Hủy đơn hàng thành công và đã hoàn lại kho!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2.4 API Xóa hoàn toàn đơn hàng khỏi CSDL MySQL
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

// 2.5 API Cập nhật trạng thái đơn hàng (Xác nhận giao hàng)
router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

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

// ==========================================
// 3. QUẢN LÝ NHÂN VIÊN (EMPLOYEES)
// ==========================================

// 3.1 Lấy danh sách nhân viên hệ thống
router.get('/employees', async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name AS name, email, phone, role FROM users WHERE role = 'EMPLOYEE' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi Lấy Danh Sách Nhân Viên:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3.2 Cấp tài khoản nhân viên mới (Dành cho Admin)
router.post('/employees', async (req, res) => {
  const { name, email, phone, password } = req.body;
  const username = req.body.username || email;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (username, full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, 'EMPLOYEE')",
      [username, name, email, phone || null, hashedPassword]
    );
    res.status(201).json({ message: 'Tạo tài khoản nhân viên thành công!', id: result.insertId });
  } catch (error) {
    console.error('Lỗi Tạo Nhân Viên Mới:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3.3 Xóa / Khóa tài khoản nhân viên
router.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ? AND role = 'EMPLOYEE'",
      [id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Xóa tài khoản nhân viên thành công!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy tài khoản nhân viên!' });
    }
  } catch (error) {
    console.error('Lỗi Xóa Nhân Viên:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;