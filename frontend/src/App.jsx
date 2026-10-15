import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import EmployeePage from './pages/EmployeePage';
import AdminPage from './pages/AdminPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const userRole = user?.role?.toUpperCase();

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
      if (userRole === 'EMPLOYEE' || userRole === 'STAFF') return <Navigate to="/employee" replace />;
      return <Navigate to="/shop" replace />;
    }
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập / đăng ký công khai */}
        <Route path="/" element={<AuthPage />} />

        <Route 
          path="/shop"
          element={
            <ProtectedRoute>
              <ShopPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE', 'STAFF']}>
              <EmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;