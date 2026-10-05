import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="footer-column">
          <h4>PHONE STORE</h4>
          <ul>
            <li><span>Giới thiệu công ty</span></li>
            <li><span>Hệ thống cửa hàng</span></li>
            <li><span>Liên hệ hợp tác</span></li>
            <li><span>Tuyển dụng</span></li>
          </ul>
        </div>

        {/* Cột 2: Danh mục sản phẩm */}
        <div className="footer-column">
          <h4>Danh mục sản phẩm</h4>
          <ul>
            <li><span>Điện thoại iPhone (iOS)</span></li>
            <li><span>Điện thoại Samsung</span></li>
            <li><span>Điện thoại Xiaomi</span></li>
            <li><span>Điện thoại phím bấm</span></li>
          </ul>
        </div>

        {/* Cột 3: Chính sách mua hàng */}
        <div className="footer-column">
          <h4>Chính sách mua hàng</h4>
          <ul>
            <li><span>Chính sách thanh toán</span></li>
            <li><span>Chính sách bảo hành</span></li>
            <li><span>Chính sách vận chuyển</span></li>
            <li><span>Chính sách bảo mật</span></li>
          </ul>
        </div>

        {/* Cột 4: Hỗ trợ khách hàng */}
        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><span>Hỗ trợ & Khiếu nại</span></li>
            <li><span>Câu hỏi thường gặp</span></li>
            <li><span>Hướng dẫn mua hàng online</span></li>
            <li><span>Trung tâm bảo hành</span></li>
          </ul>
        </div>

        {/* Cột 5: Tổng đài liên hệ */}
        <div className="footer-column">
          <h4>Tổng đài hỗ trợ (8h30 – 22h)</h4>
          <p>Gọi tư vấn: <strong>1900 1234 (Phím 1)</strong></p>
          <p>Hỗ trợ kỹ thuật: <strong>1900 1234 (Phím 2)</strong></p>
          <p>Khiếu nại: <strong>1900 1234 (Phím 3)</strong></p>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Đăng ký nhận tin & Mạng xã hội */}
      <div className="footer-middle">
        <div className="newsletter-box">
          <span>Đăng ký để nhận thông tin ưu đãi</span>
          <div className="subscribe-form">
            <input type="email" placeholder="Nhập e-mail của bạn" />
            <button type="button">→</button>
          </div>
        </div>

        <div className="social-box">
          <span>Kết nối với PHONE STORE</span>
          <div className="social-icons">
            <span className="social-icon facebook">F</span>
            <span className="social-icon zalo">Z</span>
            <span className="social-icon tiktok">T</span>
        </div>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bản quyền & Phương thức thanh toán */}
      <div className="footer-bottom">
        <div className="company-info">
          <p><strong>Công ty Cổ phần Thương mại và Dịch vụ PHONE STORE Việt Nam</strong></p>
          <p>Địa chỉ: 123 Đường Nguyễn Văn Linh, Q. Thanh Khê, TP. Đà Nẵng</p>
          <p>Email: hotro@phonestore.vn | Hotline: 1900 1234</p>
        </div>
        <div className="payment-methods">
        <span>Hỗ trợ thanh toán: </span>
        <span className="pay-badge visa">VISA</span>
        <span className="pay-badge mastercard">MasterCard</span>
        <span className="pay-badge momo">Momo</span>
        <span className="pay-badge cash">Tiền mặt</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;