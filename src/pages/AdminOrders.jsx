import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Typography, message, Modal, Form, Input, Select } from 'antd';
import { CheckOutlined, CloseOutlined, HistoryOutlined, FileImageOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // State tìm kiếm và lọc
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // State Modal Từ chối
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [form] = Form.useForm();

  // State Modal Lịch sử Audit Log
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);
  const [orderLogs, setOrderLogs] = useState([]);
  const [logLoading, setLogLoading] = useState(false);
  const [currentOrderCode, setCurrentOrderCode] = useState('');

  // State Modal Xem tài liệu đính kèm
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [orderDocs, setOrderDocs] = useState([]);
  const [docLoading, setDocLoading] = useState(false);

  const apiUrl = 'https://localhost:7158/api/Orders';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data || response.data || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      message.error('Không thể tải danh sách hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Xử lý tìm kiếm và lọc dữ liệu trên bảng
  useEffect(() => {
    let result = orders;

    if (statusFilter !== 'ALL') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (searchText.trim() !== '') {
      const keyword = searchText.toLowerCase();
      result = result.filter(o => 
        (o.orderCode && o.orderCode.toLowerCase().includes(keyword)) ||
        (o.customerName && o.customerName.toLowerCase().includes(keyword)) ||
        (o.phone && o.phone.toLowerCase().includes(keyword))
      );
    }

    setFilteredOrders(result);
  }, [searchText, statusFilter, orders]);

  // Duyệt hồ sơ
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đã duyệt hồ sơ thành công!');
      fetchOrders();
    } catch (error) {
      message.error('Không thể duyệt hồ sơ này!');
    }
  };

  // Mở modal từ chối
  const openRejectModal = (id) => {
    setCurrentOrderId(id);
    form.resetFields();
    setIsRejectModalVisible(true);
  };

  const handleRejectSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/${currentOrderId}/reject`, { reason: values.reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đã từ chối hồ sơ!');
      setIsRejectModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('Có lỗi xảy ra khi từ chối hồ sơ!');
    }
  };

  // Xem lịch sử Audit Log
  const fetchOrderLogs = async (record) => {
    try {
      setCurrentOrderCode(record.orderCode);
      setLogLoading(true);
      setIsLogModalVisible(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/${record.id}/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderLogs(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải lịch sử xử lý hồ sơ!');
    } finally {
      setLogLoading(false);
    }
  };

  // Xem tài liệu đính kèm
  const fetchOrderDocuments = async (record) => {
    try {
      setCurrentOrderCode(record.orderCode);
      setDocLoading(true);
      setIsDocModalVisible(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/${record.id}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderDocs(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải tài liệu đính kèm!');
    } finally {
      setDocLoading(false);
    }
  };

  const columns = [
    { title: 'Mã HS', dataIndex: 'orderCode', key: 'orderCode', render: (code) => <b>{code}</b> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'gold';
        let text = 'Chờ duyệt';
        if (status === 'Approved') { color = 'success'; text = 'Đã duyệt'; }
        if (status === 'Rejected') { color = 'error'; text = 'Từ chối'; }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="default" size="small" icon={<FileImageOutlined />} onClick={() => fetchOrderDocuments(record)}>Tài liệu</Button>
          <Button type="dashed" size="small" icon={<HistoryOutlined />} onClick={() => fetchOrderLogs(record)}>Lịch sử</Button>
          {record.status === 'Pending' ? (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button danger size="small" icon={<CloseOutlined />} onClick={() => openRejectModal(record.id)}>Từ chối</Button>
            </>
          ) : <Text type="secondary">Đã xử lý</Text>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3} style={{ marginBottom: 20 }}>Quản lý Hồ sơ Đăng ký Dịch vụ</Title>

      {/* Thanh Tìm kiếm và Lọc */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm mã HS, tên khách, SĐT..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        <Select value={statusFilter} onChange={(value) => setStatusFilter(value)} style={{ width: 180 }}>
          <Option value="ALL">Tất cả trạng thái</Option>
          <Option value="Pending">Chờ duyệt</Option>
          <Option value="Approved">Đã duyệt</Option>
          <Option value="Rejected">Từ chối</Option>
        </Select>
      </div>

      <Table columns={columns} dataSource={filteredOrders} rowKey="id" loading={loading} scroll={{ x: 'max-content' }} />

      {/* Modal từ chối */}
      <Modal title="Lý do từ chối hồ sơ" open={isRejectModalVisible} onCancel={() => setIsRejectModalVisible(false)} footer={null}>
        <Form layout="vertical" form={form} onFinish={handleRejectSubmit}>
          <Form.Item name="reason" label="Lý do chi tiết" rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
            <Input.TextArea rows={3} placeholder="Ví dụ: Thiếu CCCD mặt sau..." />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', margin: 0 }}>
            <Button onClick={() => setIsRejectModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" danger htmlType="submit">Xác nhận từ chối</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xem Tài liệu đính kèm */}
      <Modal title={`Tài liệu đính kèm: ${currentOrderCode}`} open={isDocModalVisible} onCancel={() => setIsDocModalVisible(false)} footer={[<Button key="close" type="primary" onClick={() => setIsDocModalVisible(false)}>Đóng</Button>]} width={600}>
        {docLoading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>Đang tải tài liệu...</div>
        ) : orderDocs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
            {orderDocs.map(doc => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
                <div>
                  <Text strong>{doc.fileName}</Text><br />
                  <Tag color="blue">{doc.fileType}</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>Tải lên: {new Date(doc.createdAt).toLocaleString('vi-VN')}</Text>
                </div>
                <Button type="primary" ghost href={`https://localhost:7158${doc.filePath}`} target="_blank">
                  Xem / Tải file
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>Khách hàng chưa upload tài liệu nào.</p>
        )}
      </Modal>

      {/* Modal Lịch sử Audit Log DẠNG BẢNG KHỚP VỚI ĐỀ CƯƠNG */}
      <Modal title={`Lịch sử xử lý: ${currentOrderCode}`} open={isLogModalVisible} onCancel={() => setIsLogModalVisible(false)} footer={[<Button key="close" type="primary" onClick={() => setIsLogModalVisible(false)}>Đóng</Button>]} width={700}>
        {logLoading ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>Đang tải lịch sử...</div>
        ) : orderLogs.length > 0 ? (
          <Table 
            dataSource={orderLogs} 
            rowKey="id" 
            pagination={false} 
            size="middle"
            bordered
            style={{ marginTop: 15 }}
            columns={[
              { 
                title: 'Thời gian', 
                dataIndex: 'createdAt', 
                render: (date) => new Date(date).toLocaleString('vi-VN') 
              },
              { 
                title: 'Người thực hiện', 
                dataIndex: 'actorName', // <-- Thay đổi ở đây: Lấy tên thật từ Backend trả về
                key: 'actorName',
                render: (text) => <b>{text || 'Hệ thống'}</b>
              },
              { 
                title: 'Thao tác', 
                dataIndex: 'action',
                render: (action) => {
                  if (action === 'Created') return <Tag color="blue">Tiếp nhận</Tag>;
                  if (action === 'Approved') return <Tag color="green">Duyệt</Tag>;
                  if (action === 'Rejected') return <Tag color="red">Từ chối</Tag>;
                  if (action === 'Resubmitted') return <Tag color="gold">Cập nhật</Tag>;
                  return action;
                }
              },
              { 
                title: 'Nội dung', 
                dataIndex: 'reason', 
                render: (reason) => reason || '---' 
              }
            ]} 
          />
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>Chưa có lịch sử thao tác.</p>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;