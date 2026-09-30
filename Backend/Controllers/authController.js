const db = require('../Config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== XỬ LÝ ĐĂNG KÝ ====================
exports.register = async (req, res) => {
  const { username, password, full_name, email, phone, role } = req.body;

  // 1. Kiểm tra thông tin bắt buộc
  if (!username || !password || !full_name || !email) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' });
  }

  try {
    // 2. Kiểm tra xem username hoặc email đã tồn tại chưa
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc Email đã được sử dụng!' });
    }

    // 3. Mã hóa mật khẩu với bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Chỉ chấp nhận CUSTOMER hoặc EMPLOYEE, còn lại mặc định CUSTOMER
    const allowedRoles = ['CUSTOMER', 'EMPLOYEE'];
    const userRole = allowedRoles.includes(role) ? role : 'CUSTOMER';

    // 5. Lưu người dùng mới vào database
    await db.execute(
      'INSERT INTO users (username, password, full_name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, full_name, email, phone || null, userRole]   // ← userRole thay cho 'CUSTOMER'
    );

    res.status(201).json({ message: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.' });

  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký!' });
  }
};

// ==================== XỬ LÝ ĐĂNG NHẬP ====================
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
  }

  try {
    // 1. Tìm user theo username
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
    }

    const user = rows[0];

    // 2. Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
    }

    // 3. Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Phản hồi thông tin về Frontend
    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập!' });
  }
};