import React, { useState } from 'react';
import './EmployeePage.css';

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'customers'

  // 1. Dữ liệu Đơn hàng
  const [orders, setOrders] = useState([
    { id: 'DH001', customer: 'Nguyễn Văn A', phone: '0901234567', total: '650.000đ', status: 'Đang xử lý' },
    { id: 'DH002', customer: 'Trần Thị B', phone: '0987654321', total: '1.290.000đ', status: 'Đã giao' },
  ]);

  // 2. Dữ liệu Sản phẩm
  const [products] = useState([
    { id: 1, name: 'Nokia 105 4G', price: '650.000đ', stock: 15, category: 'Phím bấm' },
    { id: 2, name: 'Nokia 3310 (2017)', price: '1.290.000đ', stock: 8, category: 'Phím bấm' },
  ]);

  // 3. Dữ liệu Khách hàng
  const [customers] = useState([
    { id: 'KH01', name: 'Nguyễn Văn A', phone: '0901234567', email: 'vana@gmail.com', totalOrders: 3 },
    { id: 'KH02', name: 'Trần Thị B', phone: '0987654321', email: 'thib@gmail.com', totalOrders: 1 },
  ]);

  // Thay đổi trạng thái đơn hàng
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <h2>NHÂN VIÊN</h2>
        
        <nav className="admin-nav">
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

        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>
            {activeTab === 'orders' && 'Danh Sách Đơn Hàng'}
            {activeTab === 'products' && 'Danh Sách Sản Phẩm'}
            {activeTab === 'customers' && 'Danh Sách Khách Hàng'}
          </h1>
        </header>

        <div className="table-wrapper">
          {/* 1. Tab Quản lý đơn hàng */}
          {activeTab === 'orders' && (
            <table className="admin-table">
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer}</td>
                    <td>{order.phone}</td>
                    <td>{order.total}</td>
                    <td>
                      <span className={`status-tag ${order.status === 'Đã giao' ? 'delivered' : 'pending'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status !== 'Đã giao' && (
                        <button 
                          className="action-btn"
                          onClick={() => handleStatusChange(order.id, 'Đã giao')}
                        >
                          Xác nhận giao
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 2. Tab Quản lý sản phẩm */}
          {activeTab === 'products' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá Bán</th>
                  <th>Tồn Kho</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td><strong>{prod.name}</strong></td>
                    <td>{prod.category}</td>
                    <td>{prod.price}</td>
                    <td>{prod.stock} cái</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. Tab Quản lý khách hàng */}
          {activeTab === 'customers' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã KH</th>
                  <th>Họ và Tên</th>
                  <th>Số Điện Thoại</th>
                  <th>Email</th>
                  <th>Số Đơn Đã Mua</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr key={cust.id}>
                    <td><strong>{cust.id}</strong></td>
                    <td>{cust.name}</td>
                    <td>{cust.phone}</td>
                    <td>{cust.email}</td>
                    <td>{cust.totalOrders} đơn</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeePage;;