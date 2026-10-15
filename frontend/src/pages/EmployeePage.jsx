import React, { useState, useEffect } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  // State quản lý việc đóng/mở Modal đăng xuất
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // 1. Quản lý Đơn hàng & Sản phẩm (Kết nối MySQL)
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Quản lý Khách hàng
  const [customers, setCustomers] = useState([]);
  
  // 🟢 THÊM STATE VÀ BIẾN LỌC TÌM KIẾM KHÁCH HÀNG Ở ĐÂY
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const filteredCustomers = Array.isArray(customers) ? customers.filter((cust) =>
    cust.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    cust.phone.includes(customerSearchTerm)
  ) : [];

  // Hàm tải dữ liệu thực tế từ MySQL Database qua Backend
  const loadDashboardData = async () => {
    try {
      // Tải danh sách tồn kho sản phẩm
      const resProducts = await fetch('http://localhost:5000/api/products');
      const dataProducts = await resProducts.json();
      // Bọc an toàn: Kiểm tra nếu đúng là mảng thì mới lưu vào state
      if (Array.isArray(dataProducts)) {
        setProducts(dataProducts);
      } else {
        console.error('Dữ liệu sản phẩm trả về không phải mảng:', dataProducts);
        setProducts([]);
      }

      // Tải danh sách đơn hàng
      const resOrders = await fetch('http://localhost:5000/api/orders');
      const dataOrders = await resOrders.json();
      // Bọc an toàn: Kiểm tra nếu đúng là mảng thì mới lưu vào state
      if (Array.isArray(dataOrders)) {
        setOrders(dataOrders);
      } else {
        console.error('Dữ liệu đơn hàng trả về không phải mảng:', dataOrders);
        setOrders([]);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu từ CSDL MySQL:', err);
      setProducts([]);
      setOrders([]);
    }
  };

  // Tự động tải dữ liệu khi trang vừa mở
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Lưu vào localStorage mỗi khi có thay đổi sản phẩm
  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      localStorage.setItem('app_products', JSON.stringify(products));
    }
  }, [products]);

  const filteredProducts = Array.isArray(products) ? products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  useEffect(() => {
    const customerMap = {};
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        const key = order.customer_name || order.customer || 'Khách hàng';
        if (!customerMap[key]) {
          customerMap[key] = {
            id: `KH_${Math.floor(1000 + Math.random() * 9000)}`,
            name: key,
            phone: order.customer_phone || order.phone || '090xxxxxxx',
            email: order.email || `${key.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            totalOrders: 1,
          };
        } else {
          customerMap[key].totalOrders += 1;
        }
      });
    }
    setCustomers(Object.values(customerMap));
  }, [orders]);

  // --- HÀM THAO TÁC ĐƠN HÀNG ---
  const handleStatusChange = async (orderId, newStatus) => {
    if (!Array.isArray(orders)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        if (newStatus === 'Đã giao') {
          const noticeObj = {
            id: Date.now(),
            orderId,
            message: `Đơn hàng #${orderId} của bạn đã được giao thành công!`,
            time: new Date().toLocaleTimeString('vi-VN')
          };

          localStorage.setItem('latest_notification', JSON.stringify(noticeObj));

          window.dispatchEvent(
            new CustomEvent('order_status_updated', {
              detail: noticeObj
            })
          );
        }

        alert(`Đã cập nhật đơn hàng #${orderId} sang trạng thái "${newStatus}"!`);
      } else {
        alert('Cập nhật trạng thái vào CSDL thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      alert('Không thể kết nối đến máy chủ Backend!');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn đơn hàng ${orderId} khỏi CSDL?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          if (Array.isArray(orders)) {
            const updatedOrders = orders.filter((order) => order.id !== orderId);
            setOrders(updatedOrders);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
          }
          alert(`Đã xóa vĩnh viễn đơn hàng #${orderId}!`);
        } else {
          const errorData = await res.json();
          alert(`Xóa thất bại: ${errorData.message || 'Lỗi hệ thống'}`);
        }
      } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        alert('Không thể kết nối đến máy chủ Backend!');
      }
    }
  };

  // --- HÀM THAO TÁC SẢN PHẨM ---
  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
      if (!Array.isArray(products)) return;
      setProducts(products.filter((prod) => prod.id !== productId));
    }
  };

  // --- HÀM THAO TÁC KHÁCH HÀNG ---
  const handleDeleteCustomer = (customerId, customerName) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${customerName}"?`)) {
      if (!Array.isArray(customers)) return;
      setCustomers(customers.filter((cust) => cust.id !== customerId));
    }
  };

  // HÀM XÁC NHẬN ĐĂNG XUẤT
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
                  orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>
                        <strong>
                          {(() => {
                            const rawId = order.id || order.order_code || 1;
                            return `DH${String(rawId).padStart(5, '0')}`;
                          })()}
                        </strong>
                      </td>
                      <td>{order.customer}</td>
                      <td>{order.phone || 'N/A'}</td>
                      <td>
                        {Number(order.totalAmount || order.totalPrice || order.total || 0).toLocaleString('vi-VN')}đ
                      </td>
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
            <div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm cần tìm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    width: '300px', 
                    borderRadius: '6px', 
                    border: '1px solid #cbd5e1',
                    outline: 'none'
                  }}
                />
              </div>

              <table className="employee-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Danh Mục</th>
                    <th>Giá Bán</th>
                    <th>Tồn Kho</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod, index) => (
                      <tr key={prod.id}>
                        <td><strong>{index + 1}</strong></td>
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
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                        Không tìm thấy sản phẩm phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. QUẢN LÝ KHÁCH HÀNG */}
          {activeTab === 'customers' && (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại khách hàng..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    width: '350px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none'
                  }}
                />
              </div>

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
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((cust) => (
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
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                        Không tìm thấy thông tin khách hàng phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/*   MODAL XÁC NHẬN ĐĂNG XUẤT */}
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