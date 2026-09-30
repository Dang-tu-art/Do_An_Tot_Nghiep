import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Mail, Phone, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import './AuthPage.css';
import authBg from '../assets/auth-bg.jpg';
import logo from '../assets/logo.png';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER' // Mặc định là khách hàng
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);

      if (isLogin) {
        const userObj = res.data.user;
        console.log('USER TỪ BACKEND:', userObj);
        console.log('ROLE:', userObj?.role);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(userObj));

        setMessage({ text: '✅ Đăng nhập thành công! Đang chuyển hướng...', type: 'success' });

        // 🔄 TỰ ĐỘNG ĐIỀU HƯỚNG THEO VAI TRÒ TÀI KHOẢN
        setTimeout(() => {
          const userRole = userObj?.role?.toUpperCase();
          if (userRole === 'STAFF' || userRole === 'EMPLOYEE' || userRole === 'ADMIN') {
            navigate('/employee'); // Chuyển đến trang Nhân viên
          } else {
            navigate('/shop');     // Chuyển đến trang Cửa hàng
          }
        }, 1200);

      } else {
        setMessage({ text: '✅ Đăng ký thành công! Hãy chuyển sang Đăng nhập.', type: 'success' });
        setTimeout(() => {
          setIsLogin(true);
          setMessage({ text: '', type: '' });
        }, 2000);
      }
    } catch (err) {
      setMessage({
        text: `❌ ${err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">

        {/* Bên trái: Hình ảnh & Giới thiệu */}
        <div className="auth-side-info">
          <img src={authBg} alt="Cửa hàng" className="auth-bg-img" />
          <div className="auth-side-overlay"></div>

          <div className="info-content">
            <img src={logo} alt="PhoneStore Logo" className="auth-logo" />
            <div className="text-group">
              <h1>{isLogin ? 'Chào mừng trở lại!' : 'Khám phá ngay!'}</h1>
              <p>
                {isLogin
                  ? 'Đăng nhập để trải nghiệm không gian mua sắm công nghệ đỉnh cao và nhận ưu đãi độc quyền.'
                  : 'Tạo tài khoản ngay hôm nay để sở hữu những siêu phẩm công nghệ mới nhất với mức giá tốt nhất.'}
              </p>
            </div>
            <div className="feature-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>

        {/* Bên phải: Form Đăng nhập / Đăng ký */}
        <div className="auth-side-form">
          <div className="form-content">
            <div className="form-header">
              <h2>{isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}</h2>
              <p>{isLogin ? 'Vui lòng nhập thông tin tài khoản của bạn' : 'Điền các thông tin dưới đây để bắt đầu'}</p>
            </div>

            {message.text && (
              <div className={`auth-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <>
                  <div className="input-group">
                    <User className="input-icon" size={20} />
                    <input type="text" name="full_name" placeholder="Họ và tên" onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <Mail className="input-icon" size={20} />
                    <input type="email" name="email" placeholder="Địa chỉ Email" onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <Phone className="input-icon" size={20} />
                    <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
                  </div>

                  {/* Lựa chọn vai trò Tài khoản khi Đăng ký */}
                  <div className="input-group">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#334155'
                      }}
                    >
                      <option value="CUSTOMER">Tài khoản Khách hàng</option>
                      <option value="EMPLOYEE">Tài khoản Nhân viên</option>
                    </select>
                  </div>
                </>
              )}

              <div className="input-group">
                <User className="input-icon" size={20} />
                <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
              </div>

              {isLogin && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" /> Nhớ mật khẩu
                  </label>
                  <a href="#" className="forgot-password">Quên mật khẩu?</a>
                </div>
              )}

              <button type="submit" className={`btn-submit ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    {isLogin ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản'}
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isLogin ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản rồi?'}
                <button
                  type="button"
                  className="btn-toggle"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage({ text: '', type: '' });
                  }}
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                  <ArrowRight size={16} />
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}