import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  AppstoreOutlined, 
  FileTextOutlined, 
  LogoutOutlined, 
  ShopOutlined,
  ContactsOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    // 1. Ép toàn bộ khung chiếm đúng 100% chiều cao màn hình, cắt bỏ thanh cuộn ngoài cùng
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      
      {/* Sidebar bên trái */}
      <Sider collapsible theme="dark" width={220}>
        <div style={{ height: 32, margin: '16px', color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', letterSpacing: '1px' }}>
          VNPT QUẢN TRỊ
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
            { key: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý nhân viên' },
            { key: '/admin/customers', icon: <ContactsOutlined />, label: 'Quản lý khách hàng' },
            { key: '/admin/products', icon: <AppstoreOutlined />, label: 'Quản lý dịch vụ' },
            { key: '/admin/orders', icon: <FileTextOutlined />, label: 'Quản lý hồ sơ' },
            { key: '/admin/tickets', icon: <CustomerServiceOutlined />, label: 'Quản lý Ticket hỗ trợ' },
            { key: '/admin/stores', icon: <ShopOutlined />, label: 'Quản lý điểm giao dịch' },
          ]}
        />
      </Sider>

      {/* Cột bên phải chứa Header và Nội dung */}
      <Layout style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Header cố định trên cùng */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          zIndex: 1,
          flexShrink: 0 // Ngăn Header bị bóp méo
        }}>
          <Button type="default" danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ borderRadius: 6, fontWeight: 500 }}>
            Đăng xuất
          </Button>
        </Header>

        {/* 2. Khu vực Nội dung (Content) được phép cuộn độc lập */}
        <Content style={{ 
          margin: '20px', 
          padding: 0, 
          // Cho phép cuộn dọc nội dung bên trong nếu trang quá dài
          overflowY: 'auto', 
          overflowX: 'hidden',
          flexGrow: 1,
          borderRadius: 8
        }}>
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
};

export default MainLayout;