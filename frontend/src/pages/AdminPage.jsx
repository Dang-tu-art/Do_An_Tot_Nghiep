import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  // Đặt mặc định mở tab Thống kê tổng quan khi mới vào
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // States quản lý dữ liệu
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  // --- STATE QUẢN LÝ SẢN PHẨM (THÊM / SỬA) ---
  const [showProductForm, setShowProductForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Điện thoại',
    brand: 'Apple',
    price: '',
    stock: 10,
    image: ''
  });
  const [customBrand, setCustomBrand] = useState('');

  // --- STATE QUẢN LÝ NHÂN VIÊN (THÊM MỚI) ---
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'EMPLOYEE'
  });

  // Tải dữ liệu thực tế từ Backend
  const loadDashboardData = async () => {
    try {
      const resProducts = await fetch('http://localhost:5000/api/products');
      const dataProducts = await resProducts.json();
      setProducts(Array.isArray(dataProducts) ? dataProducts : []);

      const resOrders = await fetch('http://localhost:5000/api/orders');
      const dataOrders = await resOrders.json();
      setOrders(Array.isArray(dataOrders) ? dataOrders : []);

      const resEmployees = await fetch('http://localhost:5000/api/employees');
      const dataEmployees = await resEmployees.json();
      setEmployees(Array.isArray(dataEmployees) ? dataEmployees : []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu từ CSDL MySQL:', err);
      setProducts([]);
      setOrders([]);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      localStorage.setItem('app_products', JSON.stringify(products));
    }
  }, [products]);

  // Tổng hợp dữ liệu Khách hàng từ Đơn hàng
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

  // --- 📊 TÍNH TOÁN DỮ LIỆU THỐNG KÊ TỰ ĐỘNG ---
const totalRevenue = Array.isArray(orders)
  ? orders
      .filter((order) => order.status === 'Đã giao') 
      .reduce((sum, order) => {
        const rawAmount = order.totalAmount || order.totalPrice || order.total || 0;
        const amount = Number(rawAmount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0)
  : 0;

const totalOrdersCount = Array.isArray(orders) ? orders.length : 0;
const deliveredOrdersCount = Array.isArray(orders)
  ? orders.filter((o) => o.status === 'Đã giao').length
  : 0;
const totalProductsCount = Array.isArray(products) ? products.length : 0;
const totalEmployeesCount = Array.isArray(employees) ? employees.length : 0;

  // --- HÀM THAO TÁC ĐƠN HÀNG ---
  const handleStatusChange = async (orderId, newStatus) => {
    if (!Array.isArray(orders)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
            new CustomEvent('order_status_updated', { detail: noticeObj })
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
  const handleOpenAddForm = () => {
    setFormData({ id: '', name: '', category: 'Điện thoại', brand: 'Apple', price: '', stock: 10, image: '' });
    setIsEditing(false);
    setShowProductForm(true);
  };

  const handleOpenEditForm = (product) => {
  setFormData({
    id: product.id,
    name: product.name || '',
    category: product.category || 'Điện thoại',
    brand: product.brand || 'Apple',
    price: product.price || '',
    stock: product.stock || 0,
    image: product.image || '' 
  });

  // Xử lý nếu là thương hiệu gõ tay (Khác)
  const isStandardBrand = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Realme', 'Nokia'].includes(product.brand);
  if (!isStandardBrand && product.brand) {
    setFormData((prev) => ({ ...prev, brand: 'Khác' }));
    if (typeof setCustomBrand === 'function') {
      setCustomBrand(product.brand);
    }
  }

  setIsEditing(true);
  setShowProductForm(true);
};
  // Hàm xử lý chọn ảnh từ máy tính
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }
};
  const handleSaveProduct = async (e) => {
  e.preventDefault();
  const payload = {
    ...formData,
    price: Number(formData.price) || 0, // Chuyển chuỗi '18900000' thành số 18900000
    stock: Number(formData.stock) || 0,
    category: formData.category || 'Điện thoại',
    brand: formData.brand === 'Khác' ? customBrand : formData.brand
  };

  const url = isEditing
    ? `http://localhost:5000/api/products/${formData.id}`
    : 'http://localhost:5000/api/products';
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(isEditing ? 'Cập nhật thông tin thành công!' : 'Thêm sản phẩm mới thành công!');
      setShowProductForm(false);
      setCustomBrand('');
      loadDashboardData();
    } else {
      alert('Lưu sản phẩm thất bại!');
    }
  } catch (error) {
    console.error('Lỗi khi lưu sản phẩm:', error);
  }
};
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}" khỏi CSDL?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          if (Array.isArray(products)) {
            setProducts(products.filter((prod) => prod.id !== productId));
          }
          alert(`Đã xóa sản phẩm "${productName}"!`);
        } else {
          alert('Xóa sản phẩm thất bại!');
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Không thể kết nối Backend!');
      }
    }
  };

  // --- HÀM THAO TÁC NHÂN VIÊN ---
  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeFormData),
      });

      if (res.ok) {
        alert('Cấp tài khoản nhân viên thành công!');
        setShowEmployeeForm(false);
        setEmployeeFormData({ name: '', email: '', phone: '', password: '', role: 'EMPLOYEE' });
        loadDashboardData();
      } else {
        alert('Thêm nhân viên thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi tạo nhân viên:', error);
      alert('Không thể kết nối Backend!');
    }
  };

  const handleDeleteEmployee = async (empId, empName) => {
    if (window.confirm(`Bạn có chắc muốn xóa/khóa tài khoản nhân viên "${empName}"?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/${empId}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          if (Array.isArray(employees)) {
            setEmployees(employees.filter((emp) => emp.id !== empId));
          }
          alert(`Đã xóa tài khoản nhân viên "${empName}"!`);
        } else {
          alert('Xóa nhân viên thất bại!');
        }
      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        alert('Không thể kết nối Backend!');
      }
    }
  };

  // --- HÀM THAO TÁC KHÁCH HÀNG ---
  const handleDeleteCustomer = (customerId, customerName) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${customerName}"?`)) {
      if (!Array.isArray(customers)) return;
      setCustomers(customers.filter((cust) => cust.id !== customerId));
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="employee-container">
      {/* Sidebar Navigation */}
      <aside className="employee-sidebar">
        <h2>QUẢN LÝ</h2>

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

          <button
            className={activeTab === 'employees' ? 'active' : ''}
            onClick={() => setActiveTab('employees')}
          >
            👔 Quản lý nhân viên
          </button>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Báo cáo Thống kê
          </button>
        </nav>

        <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="employee-content">
        <header className="employee-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>
            {activeTab === 'dashboard' && 'Báo Cáo & Thống Kê Tổng Quan'}
            {activeTab === 'orders' && 'Danh Sách Đơn Hàng'}
            {activeTab === 'products' && 'Danh Sách Sản Phẩm Trong Kho'}
            {activeTab === 'customers' && 'Danh Sách Khách Hàng'}
            {activeTab === 'employees' && 'Danh Sách Nhân Viên Hệ Thống'}
          </h1>

          {/* Nút thêm mới theo từng Tab */}
          {activeTab === 'products' && (
            <button className="action-btn btn-success" onClick={handleOpenAddForm}>
              ➕ Thêm Sản Phẩm Mới
            </button>
          )}

          {activeTab === 'employees' && (
            <button className="action-btn btn-success" onClick={() => setShowEmployeeForm(true)}>
              ➕ Thêm Nhân Viên Mới
            </button>
          )}
        </header>

        {/* 1. TAB BÁO CÁO THỐNG KÊ RIÊNG BIỆT */}
        {activeTab === 'dashboard' && (
          <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '10px' }}>
            <div className="analytics-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #16a34a' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>💵 TỔNG DOANH THU</span>
              <h2 style={{ margin: '10px 0 0', color: '#16a34a', fontSize: '24px' }}>
                {totalRevenue.toLocaleString('vi-VN')}đ
              </h2>
            </div>

            <div className="analytics-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #2563eb' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>📋 TỔNG ĐƠN HÀNG</span>
              <h2 style={{ margin: '10px 0 0', color: '#2563eb', fontSize: '24px' }}>
                {totalOrdersCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>đơn</span>
              </h2>
            </div>

            <div className="analytics-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #059669' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>✅ ĐƠN ĐÃ GIAO</span>
              <h2 style={{ margin: '10px 0 0', color: '#059669', fontSize: '24px' }}>
                {deliveredOrdersCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>đơn</span>
              </h2>
            </div>

            <div className="analytics-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #ea580c' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>📦 SẢN PHẨM KHO</span>
              <h2 style={{ margin: '10px 0 0', color: '#ea580c', fontSize: '24px' }}>
                {totalProductsCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>mẫu</span>
              </h2>
            </div>

            <div className="analytics-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #9333ea' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>👔 NHÂN VIÊN</span>
              <h2 style={{ margin: '10px 0 0', color: '#9333ea', fontSize: '24px' }}>
                {totalEmployeesCount} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>người</span>
              </h2>
            </div>
          </div>
        )}

        {/* FORM THÊM / SỬA SẢN PHẨM */}
        {showProductForm && activeTab === 'products' && (
          <div className="admin-form-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>{isEditing ? '✏ Chỉnh Sửa Thông Tin Sản Phẩm' : '➕ Nhập Sản Phẩm Mới Về Kho'}</h3>
            <form onSubmit={handleSaveProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div>
                <label>Tên Sản Phẩm:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: iPhone 15 Pro Max"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Hãng / Thương Hiệu:</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="OPPO">OPPO</option>
                  <option value="Realme">Realme</option>
                  <option value="Nokia">Nokia</option>
                  <option value="Khác">Khác</option>
                </select>
                {formData.brand === 'Khác' && (
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên hãng (Ví dụ: Vivo, Asus, Tecno...)"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '8px', borderColor: '#2563eb' }}
                  />
                )}
              </div>

              <div>
                <label>Giá Bán (VNĐ):</label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 25990000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Số Lượng Tồn Kho:</label>
                <input
                  type="number"
                  required
                  placeholder="10"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Hình Ảnh Sản Phẩm (Chọn từ máy):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
                {/* Xem trước hình ảnh sau khi chọn */}
                {formData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Xem trước ảnh:</p>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                    />
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="action-btn btn-success">
                  {isEditing ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm'}
                </button>
                <button type="button" className="action-btn btn-danger" onClick={() => setShowProductForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
        {/* FORM THÊM NHÂN VIÊN MỚI */}
        {showEmployeeForm && activeTab === 'employees' && (
          <div className="admin-form-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>➕ Cấp Tài Khoản Nhân Viên Mới</h3>
            <form onSubmit={handleSaveEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div>
                <label>Họ và Tên Nhân Viên:</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={employeeFormData.name}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Email Đăng Nhập:</label>
                <input
                  type="email"
                  required
                  placeholder="nhanvien@phonestore.vn"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Số Điện Thoại:</label>
                <input
                  type="text"
                  required
                  placeholder="0901234567"
                  value={employeeFormData.phone}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div>
                <label>Mật Khẩu Ban Đầu:</label>
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={employeeFormData.password}
                  onChange={(e) => setEmployeeFormData({ ...employeeFormData, password: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="action-btn btn-success">
                  Cấp Tài Khoản
                </button>
                <button type="button" className="action-btn btn-danger" onClick={() => setShowEmployeeForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLES CONTAINER */}
        <div className="table-wrapper">
         {/* 2. QUẢN LÝ ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                      <td><strong className="text-blue">{index + 1}</strong></td>
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
          {/* 3. QUẢN LÝ SẢN PHẨM */}
          {activeTab === 'products' && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Hãng</th>
                  <th>Giá Bán</th>
                  <th>Tồn Kho</th>
                  <th>Thao Tác Quản Lý</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  [...products]
                    .sort((a, b) => Number(a.id) - Number(b.id))
                    .map((prod, index) => ( 
                      <tr key={prod.id}>
                        <td><strong>{index + 1}</strong></td> 
                        <td><strong>{prod.name}</strong></td>
                        <td>{prod.brand || prod.category || 'N/A'}</td>
                        <td>
                          {Number(prod.price).toLocaleString('vi-VN')}đ
                        </td>

                        <td>{prod.stock ? `${prod.stock} cái` : 'Đang bán'}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn"
                              style={{ background: '#f59e0b', color: '#fff' }}
                              onClick={() => handleOpenEditForm(prod)}
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              className="action-btn btn-danger"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)} 
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                      Chưa có sản phẩm nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 4. QUẢN LÝ KHÁCH HÀNG */}
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

          {/* 5. QUẢN LÝ NHÂN VIÊN */}
          {activeTab === 'employees' && (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Chức Vụ</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td><strong>{index + 1}</strong></td>
                      <td><strong>{emp.name}</strong></td>
                      <td>{emp.email}</td>
                      <td>{emp.phone || 'Chưa cập nhật'}</td>
                      <td>
                        <span className="order-count-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          {emp.role || 'Nhân viên'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn btn-danger"
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                        >
                          Xóa / Khóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>Chưa có tài khoản nhân viên nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
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

export default AdminPage;