import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Button, message, Space, Modal, Select, Input } from 'antd';
import { TeamOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // State Modal chỉnh sửa khách hàng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerType, setCustomerType] = useState('Cá nhân');
  const [status, setStatus] = useState('Đang hoạt động');

  // Lấy danh sách khách hàng từ Backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Gọi API lấy toàn bộ user có role là Customer
      const response = await axios.get('https://localhost:7158/api/Users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allUsers = response.data.data || response.data || [];
      // Lọc chỉ lấy khách hàng (Role == "Customer")
      const listCustomer = allUsers.filter(u => u.role === 'Customer' || !u.role || u.role === '');
      setCustomers(listCustomer);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenEdit = (record) => {
    setEditingCustomer(record);
    setCustomerType(record.customerType || 'Cá nhân');
    setStatus(record.status || 'Đang hoạt động');
    setIsModalOpen(true);
  };

  // Lưu thay đổi thông tin quản lý (Loại KH, Tình trạng)
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://localhost:7158/api/Users/${editingCustomer.id}/admin-update`, {
        customerType,
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      message.success('Cập nhật thông tin khách hàng thành công!');
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error(error);
      message.error('Không thể cập nhật khách hàng này!');
    }
  };

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username', render: (text) => <b>{text}</b> },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'CC/CCCD', dataIndex: 'cccd', key: 'cccd' },
    { title: 'Khu vực', dataIndex: 'province', key: 'province' },
    { 
      title: 'Loại KH', 
      dataIndex: 'customerType', 
      key: 'customerType',
      render: (val) => <Tag color="blue">{val || 'Cá nhân'}</Tag>
    },
    { 
      title: 'Tình trạng', 
      dataIndex: 'status', 
      key: 'status',
      render: (val) => {
        let color = val === 'Bị khóa' ? 'red' : 'green';
        return <Tag color={color}>{val || 'Đang hoạt động'}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>
          Quản lý
        </Button>
      ),
    },
  ];

  const filteredData = customers.filter(c => 
    (c.fullName && c.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
    (c.username && c.username.toLowerCase().includes(searchText.toLowerCase())) ||
    (c.phone && c.phone.includes(searchText))
  );

  return (
    <div>
      <Title level={3} style={{ color: '#005baa', marginBottom: 20 }}>
        <TeamOutlined /> Quản lý Hệ thống Khách hàng VNPT
      </Title>

      <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <Input 
            placeholder="Tìm kiếm theo tên, username hoặc SĐT..." 
            prefix={<SearchOutlined />} 
            style={{ width: 350 }} 
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table 
          dataSource={filteredData} 
          columns={columns} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 6 }} 
        />
      </Card>

      {/* Modal cho phép Admin đổi loại KH và trạng thái */}
      <Modal
        title={<span style={{ color: '#005baa', fontWeight: 'bold' }}>Cập nhật thông tin khách hàng</span>}
        open={isModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        {editingCustomer && (
          <div style={{ marginTop: 20 }}>
            <p><strong>Khách hàng:</strong> {editingCustomer.fullName} ({editingCustomer.username})</p>
            
            <div style={{ marginBottom: 15, marginTop: 15 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Loại khách hàng:</label>
              <Select value={customerType} onChange={(val) => setCustomerType(val)} style={{ width: '100%' }} size="large">
                <Option value="Cá nhân">Cá nhân</Option>
                <Option value="Doanh nghiệp">Doanh nghiệp</Option>
                <Option value="VIP">VIP</Option>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5 }}>Tình trạng tài khoản:</label>
              <Select value={status} onChange={(val) => setStatus(val)} style={{ width: '100%' }} size="large">
                <Option value="Đang hoạt động">Đang hoạt động</Option>
                <Option value="Bị khóa">Bị khóa</Option>
                <Option value="Chờ duyệt">Chờ duyệt</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCustomers;