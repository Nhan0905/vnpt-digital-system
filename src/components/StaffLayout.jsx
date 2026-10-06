import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { DashboardOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const StaffLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="dark" style={{ background: '#001529' }}>
        <div style={{ height: 32, margin: 16, color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          VNPT NHÂN VIÊN
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          onClick={({ key }) => navigate(key)}
          items={[
            { key: '/staff/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
            { key: '/staff/orders', icon: <FileTextOutlined />, label: 'Quản lý hồ sơ' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ marginRight: 15 }}>Xin chào, <b>{localStorage.getItem('fullName')}</b></span>
          <Button type="default" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {/* Outlet sẽ render dùng chung trang Dashboard và Orders */}
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;