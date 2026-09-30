import React, { useState, useEffect } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  
  // 🆕 State quản lý việc đóng/mở Modal đăng xuất
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 1. Quản lý Đơn hàng
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders') || localStorage.getItem('app_orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      { id: 'DH001', customer: 'Nguyễn Văn A', phone: '0901234567', total: '650.000đ', status: 'Đang xử lý' },
      { id: 'DH002', customer: 'Trần Thị B', phone: '0987654321', total: '1.290.000đ', status: 'Đã giao' },
    ];
  });

  // 2. Quản lý Sản phẩm
  const [products, setProducts] = useState([
    { id: 1, name: 'Nokia 105 4G', price: '650.000đ', stock: 15, category: 'Phím bấm' },
    { id: 2, name: 'Nokia 3310 (2017)', price: '1.050.000đ', stock: 8, category: 'Phím bấm' },
    { id: 3, name: 'iPhone 13 128GB', price: '13.990.000đ', stock: 5, category: 'Apple' },
    { id: 4, name: 'Samsung Galaxy A55 5G', price: '9.990.000đ', stock: 10, category: 'Samsung' },
  ]);

  // 3. Quản lý Khách hàng
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const customerMap = {};
    orders.forEach((order) => {
      const key = order.customer || 'Khách hàng';
      if (!customerMap[key]) {
        customerMap[key] = {
          id: `KH_${Math.floor(1000 + Math.random() * 9000)}`,
          name: key,
          phone: order.phone || '090xxxxxxx',
          email: order.email || `${key.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          totalOrders: 1,
        };
      } else {
        customerMap[key].totalOrders += 1;
      }
    });
    setCustomers(Object.values(customerMap));
  }, [orders]);

  // --- HÀM THAO TÁC ĐƠN HÀNG ---
 // Đổi trạng thái giao hàng và gửi thông báo sang trang Khách hàng
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    
    // 1. Lưu danh sách đơn hàng cập nhật vào localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // 2. Nếu chuyển sang trạng thái "Đã giao", tạo dữ liệu thông báo
    if (newStatus === 'Đã giao') {
      const noticeObj = {
        id: Date.now(),
        orderId,
        message: `Đơn hàng #${orderId} của bạn đã được giao thành công!`,
        time: new Date().toLocaleTimeString('vi-VN')
      };

      // Lưu vào localStorage để Tab khác bắt được sự kiện
      localStorage.setItem('latest_notification', JSON.stringify(noticeObj));

      // Phát CustomEvent để Tab hiện tại (nếu dùng chung) bắt được ngay
      window.dispatchEvent(
        new CustomEvent('order_status_updated', {
          detail: noticeObj
        })
      );
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Bạn có chắc muốn xóa đơn hàng #${orderId}?`)) {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  // --- HÀM THAO TÁC SẢN PHẨM ---
  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
      setProducts(products.filter((prod) => prod.id !== productId));
    }
  };

  // --- HÀM THAO TÁC KHÁCH HÀNG ---
  const handleDeleteCustomer = (customerId, customerName) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${customerName}"?`)) {
      setCustomers(customers.filter((cust) => cust.id !== customerId));
    }
  };

  // 🆕 HÀM XÁC NHẬN ĐĂNG XUẤT THẬT SUẤT
  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="employee-container">
      {/* Sidebar */}
      <aside className="employee-sidebar">
        <h2>NHÂN VIÊN</h2>

        <nav className="employee-nav">
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            📋 Quản lý đơn hàng
          </button>

          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            📦 Quản lý sản phẩm
          </button>

          <button
            className={activeTab === 'customers' ? 'active' : ''}
            onClick={() => setActiveTab('customers')}
          >
            👥 Quản lý khách hàng
          </button>
        </nav>

        {/* 🆕 Nút mở Modal đăng xuất */}
        <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
          Đăng xuất
        </button>
      </aside>

      {/* Content */}
      <main className="employee-content">
        <header className="employee-header">
          <h1>
            {activeTab === 'orders' && 'Danh Sách Đơn Hàng'}
            {activeTab === 'products' && 'Danh Sách Sản Phẩm'}
            {activeTab === 'customers' && 'Danh Sách Khách Hàng'}
          </h1>
        </header>

        <div className="table-wrapper">
          {/* 1. QUẢN LÝ ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>SĐT</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td><strong className="text-blue">{order.id}</strong></td>
                      <td>{order.customer}</td>
                      <td>{order.phone || 'N/A'}</td>
                      <td>{typeof order.total === 'number' ? order.total.toLocaleString('vi-VN') + 'đ' : order.total}</td>
                      <td>
                        <span className={`status-tag ${order.status === 'Đã giao' ? 'delivered' : 'pending'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {order.status !== 'Đã giao' && (
                            <button
                              className="action-btn btn-success"
                              onClick={() => handleStatusChange(order.id, 'Đã giao')}
                            >
                              Xác nhận giao
                            </button>
                          )}
                          <button
                            className="action-btn btn-danger"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>Chưa có đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 2. QUẢN LÝ SẢN PHẨM */}
          {activeTab === 'products' && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá Bán</th>
                  <th>Tồn Kho</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((prod) => (
                    <tr key={prod.id}>
                      <td><strong>#{prod.id}</strong></td>
                      <td><strong>{prod.name}</strong></td>
                      <td>{prod.category}</td>
                      <td>{prod.price}</td>
                      <td>{prod.stock} cái</td>
                      <td>
                        <button
                          className="action-btn btn-danger"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>Chưa có sản phẩm nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 3. QUẢN LÝ KHÁCH HÀNG */}
          {activeTab === 'customers' && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Mã KH</th>
                  <th>Họ và Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Email</th>
                  <th>Đơn Đã Đặt</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((cust) => (
                    <tr key={cust.id}>
                      <td><strong>{cust.id}</strong></td>
                      <td>{cust.name}</td>
                      <td>{cust.phone}</td>
                      <td>{cust.email}</td>
                      <td><span className="order-count-badge">{cust.totalOrders} đơn</span></td>
                      <td>
                        <button
                          className="action-btn btn-danger"
                          onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>Chưa có thông tin khách hàng.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/*  MODAL XÁC NHẬN ĐĂNG XUẤT */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon"></div>
            <h3>Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            <div className="confirm-actions">
              <button className="confirm-btn-yes" onClick={confirmLogout}>
                Có, đăng xuất
              </button>
              <button className="confirm-btn-no" onClick={() => setShowLogoutConfirm(false)}>
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;