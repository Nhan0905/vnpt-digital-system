import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import AdminCustomers from './pages/AdminCustomers';
import Products from './pages/Products';
import AdminOrders from './pages/AdminOrders';
import AdminStores from './pages/AdminStores';
import AdminTickets from './pages/AdminTickets'; // <-- 1. Import trang Ticket
import MainLayout from './components/MainLayout';
import StaffLayout from './components/StaffLayout';
import CustomerPortal from './pages/CustomerPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer-portal" element={<CustomerPortal />} />

        {/* Phân hệ QUẢN TRỊ VIÊN (ADMIN) */}
        <Route path="/admin" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="tickets" element={<AdminTickets />} /> {/* <-- 2. Khai báo route */}
          <Route path="stores" element={<AdminStores />} />
        </Route>

        {/* Phân hệ NHÂN VIÊN (STAFF) */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="tickets" element={<AdminTickets />} /> {/* Có thể cho cả Staff vào quản lý ticket */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;