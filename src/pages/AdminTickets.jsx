import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Button, Modal, Form, Input, Select, message, Descriptions } from 'antd';
import { CustomerServiceOutlined, EditOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [form] = Form.useForm();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7158/api/SupportTickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách yêu cầu hỗ trợ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenProcess = (record) => {
    setSelectedTicket(record);
    form.setFieldsValue({
      status: record.status || 'Đang xử lý',
      assignedTechnician: record.assignedTechnician || '',
      responseNote: record.responseNote || ''
    });
    setIsModalVisible(true);
  };

  const handleUpdateTicket = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://localhost:7158/api/SupportTickets/${selectedTicket.id}/process`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đã cập nhật xử lý yêu cầu thành công!');
      setIsModalVisible(false);
      fetchTickets();
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const columns = [
    { title: 'Tiêu đề sự cố', dataIndex: 'title', key: 'title', render: (text) => <b style={{ color: '#004b87' }}>{text}</b> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Ngày gửi', dataIndex: 'createdAt', key: 'createdAt', render: (val) => val ? new Date(val).toLocaleString('vi-VN') : '---' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (val) => {
        let color = val === 'Đã hoàn thành' ? 'success' : val === 'Đang xử lý' ? 'warning' : 'error';
        return <Tag color={color} style={{ borderRadius: 6, padding: '2px 10px' }}>{val || 'Chờ tiếp nhận'}</Tag>;
      }
    },
    { title: 'Kỹ thuật viên', dataIndex: 'assignedTechnician', key: 'assignedTechnician', render: (val) => val || <Text type="secondary">Chưa phân công</Text> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleOpenProcess(record)} style={{ background: '#004b87', borderRadius: 6 }}>
          Xử lý / Phản hồi
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '0 10px' }}>
      <div style={{ marginBottom: 25 }}>
        <Title level={3} style={{ color: '#004b87', margin: 0, fontWeight: 800 }}>
          <CustomerServiceOutlined /> Quản lý Yêu cầu Hỗ trợ & Báo hỏng mạng
        </Title>
        <Text type="secondary">Tiếp nhận thông tin sự cố từ khách hàng, phân công kỹ thuật viên và phản hồi hướng giải quyết.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} styles={{ body: { padding: '20px' } }}>
        <Table dataSource={tickets} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 6 }} />
      </Card>

      <Modal
        title={<span style={{ color: '#004b87', fontWeight: 'bold', fontSize: '16px' }}>Xử lý yêu cầu hỗ trợ khách hàng</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={650}
        centered
      >
        {selectedTicket && (
          <div>
            <Descriptions bordered size="small" column={1} style={{ marginBottom: 20, marginTop: 15 }}>
              <Descriptions.Item label="Khách hàng"><b>{selectedTicket.customerName}</b> ({selectedTicket.phone})</Descriptions.Item>
              <Descriptions.Item label="Tiêu đề sự cố"><span style={{ color: '#d81b60', fontWeight: 'bold' }}>{selectedTicket.title}</span></Descriptions.Item>
              <Descriptions.Item label="Nội dung chi tiết">{selectedTicket.content}</Descriptions.Item>
              {selectedTicket.imagePath && (
                <Descriptions.Item label="Ảnh minh chứng sự cố">
                  <a href={`https://localhost:7158${selectedTicket.imagePath}`} target="_blank" rel="noopener noreferrer">
                    <img src={`https://localhost:7158${selectedTicket.imagePath}`} alt="Sự cố" style={{ maxHeight: 140, borderRadius: 8, border: '1px solid #ddd' }} />
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Form form={form} layout="vertical" onFinish={handleUpdateTicket}>
              <Form.Item name="status" label="Trạng thái xử lý" rules={[{ required: true }]}>
                <Select size="large" style={{ borderRadius: 6 }}>
                  <Option value="Chờ tiếp nhận">Chờ tiếp nhận</Option>
                  <Option value="Đang xử lý">Đang xử lý</Option>
                  <Option value="Đã hoàn thành">Đã hoàn thành</Option>
                </Select>
              </Form.Item>

              <Form.Item name="assignedTechnician" label="Phân công nhân viên kỹ thuật">
                <Input placeholder="Nhập tên nhân viên kỹ thuật phụ trách..." size="large" style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item name="responseNote" label="Nội dung phản hồi / Hướng giải quyết cho khách">
                <TextArea rows={3} placeholder="Nhập hướng giải quyết hoặc thông báo lịch sửa chữa..." style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 20 }}>
                <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 10, borderRadius: 6 }}>Hủy</Button>
                <Button type="primary" htmlType="submit" size="large" style={{ background: '#004b87', borderRadius: 6, fontWeight: 'bold' }}>
                  Lưu & Gửi phản hồi
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTickets;