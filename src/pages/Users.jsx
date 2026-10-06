import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Button, Modal, Form, Input, Select } from 'antd';
import { UserAddOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State quản lý hiển thị Popup (Modal) thêm nhân viên
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Hàm tải danh sách
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7158/api/Users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách user:", error);
      message.error('Không thể lấy danh sách nhân viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xử lý khi submit form Thêm nhân viên
  const handleAddUser = async (values) => {
    try {
      setLoading(true);
      // Gọi API đăng ký của Backend
      await axios.post('https://localhost:7158/api/Users/register', {
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        role: values.role // Sẽ là 'Admin' hoặc 'Staff'
      });
      
      message.success('Thêm nhân viên mới thành công!');
      setIsModalVisible(false); // Tắt popup
      form.resetFields(); // Xóa dữ liệu form
      fetchUsers(); // Load lại bảng danh sách
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra, tên đăng nhập có thể đã tồn tại!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { 
      title: 'Vai trò', 
      dataIndex: 'role', 
      key: 'role',
      render: (role) => (
        <Tag color={role === 'Admin' ? 'volcano' : 'blue'}>{role || 'Staff'}</Tag>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive !== false ? 'success' : 'error'}>
          {isActive !== false ? 'Đang hoạt động' : 'Đã khóa'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" danger={record.isActive !== false} icon={record.isActive !== false ? <LockOutlined /> : <UnlockOutlined />}>
          {record.isActive !== false ? 'Khóa' : 'Mở khóa'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>Quản lý Tài khoản & Phân quyền</Title>
        {/* Nút bật Popup */}
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalVisible(true)}>
          Thêm nhân viên mới
        </Button>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />

      {/* Popup Modal Form Thêm Nhân Viên */}
      <Modal 
        title="Thêm nhân viên mới" 
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Tắt footer mặc định để dùng nút submit của Form
      >
        <Form layout="vertical" form={form} onFinish={handleAddUser}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
            <Input placeholder="Nhập tên đăng nhập (VD: nhanvien_a)" />
          </Form.Item>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item name="role" label="Phân quyền" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
            <Select placeholder="Chọn vai trò">
              <Option value="Staff">Nhân viên (Staff)</Option>
              <Option value="Admin">Quản trị viên (Admin)</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', margin: 0 }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Xác nhận thêm</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;