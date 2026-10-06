import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Statistic, Typography, message, Table, Tag, Modal, Descriptions } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  EyeOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined, 
  FileExcelOutlined 
} from '@ant-design/icons';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import axios from 'axios';

const { Title, Text } = Typography;
const COLORS = ['#faad14', '#52c41a', '#ff4d4f']; // Vàng (Chờ duyệt), Xanh (Đã duyệt), Đỏ (Từ chối)

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [chartData, setChartData] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(false);

  // State quản lý Popup Modal xem chi tiết hồ sơ
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const showModal = (record) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // 1. Lấy thống kê tổng quan từ API
        const statsResponse = await axios.get('https://localhost:7158/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = statsResponse.data.data;
        
        const total = statsData.totalOrders || 0;
        const approved = statsData.approvedOrders || 0;
        const pending = statsData.pendingOrders || 0;
        const rejected = statsData.rejectedOrders || 0;

        setStats({ total, approved, pending, rejected });

        // Dữ liệu cho biểu đồ
        setChartData([
          { name: 'Chờ duyệt', count: pending },
          { name: 'Đã duyệt', count: approved },
          { name: 'Từ chối', count: rejected }
        ]);

        // 2. Lấy danh sách hồ sơ gần đây
        const ordersResponse = await axios.get('https://localhost:7158/api/Orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersResponse.data.data || ordersResponse.data || []); 

      } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard:", error);
        message.error('Không thể tải dữ liệu trang tổng quan!');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm gọi API xuất file Excel
  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7158/api/dashboard/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BaoCaoThongKe.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Xuất file Excel thành công!');
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi xuất file Excel!');
    }
  };

  // Cấu hình các cột cho Table danh sách hồ sơ
  const columns = [
    { title: 'Mã hồ sơ', dataIndex: 'orderCode', key: 'orderCode', render: (code) => <b style={{ color: '#004b87' }}>{code}</b> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', render: (name) => name || '---' }, 
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', render: (phone) => phone || '---' },
    { 
      title: 'Ngày đăng ký', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (text) => text ? new Date(text).toLocaleString('vi-VN') : ''
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const st = status ? status.toUpperCase() : '';
        let color = st === 'APPROVED' ? 'success' : st === 'REJECTED' ? 'error' : 'warning';
        let text = st === 'APPROVED' ? 'Đã duyệt' : st === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt';
        return <Tag color={color} style={{ borderRadius: 6, padding: '2px 10px', fontWeight: 500 }}>{text}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => showModal(record)} style={{ color: '#004b87', fontWeight: 'bold' }}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 10px' }}>
      {/* HEADER TIÊU ĐỀ & NÚT XUẤT EXCEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, flexWrap: 'wrap', gap: 15 }}>
        <div>
          <Title level={3} style={{ color: '#004b87', margin: 0, fontWeight: 800 }}>
            Tổng quan hệ thống VNPT
          </Title>
          <Text type="secondary">Thống kê số liệu, trực quan hóa biểu đồ và theo dõi hồ sơ đăng ký dịch vụ trực tuyến.</Text>
        </div>
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />} 
          onClick={handleExportExcel}
          style={{ 
            background: '#52c41a', 
            borderColor: '#52c41a', 
            height: 40, 
            fontWeight: 'bold', 
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.2)' 
          }}
        >
          Xuất Báo Cáo Excel
        </Button>
      </div>

      {/* CÁC THẺ THỐNG KÊ (STAT CARDS) GRADIENT HIỆN ĐẠI */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', boxShadow: '0 6px 16px rgba(0, 145, 255, 0.12)' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic 
              title={<span style={{ color: '#0050b3', fontWeight: 'bold', fontSize: '15px' }}>Tổng số hồ sơ</span>} 
              value={stats.total} 
              prefix={<FileTextOutlined style={{ color: '#1890ff', marginRight: 8 }} />} 
              valueStyle={{ color: '#002766', fontWeight: 900, fontSize: '30px' }} 
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)', boxShadow: '0 6px 16px rgba(82, 196, 26, 0.12)' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic 
              title={<span style={{ color: '#389e0d', fontWeight: 'bold', fontSize: '15px' }}>Hồ sơ đã duyệt</span>} 
              value={stats.approved} 
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />} 
              valueStyle={{ color: '#135200', fontWeight: 900, fontSize: '30px' }} 
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)', boxShadow: '0 6px 16px rgba(250, 140, 22, 0.12)' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic 
              title={<span style={{ color: '#d46b08', fontWeight: 'bold', fontSize: '15px' }}>Hồ sơ chờ duyệt</span>} 
              value={stats.pending} 
              prefix={<ClockCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />} 
              valueStyle={{ color: '#873800', fontWeight: 900, fontSize: '30px' }} 
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)', boxShadow: '0 6px 16px rgba(255, 77, 79, 0.12)' }} styles={{ body: { padding: '20px 24px' } }}>
            <Statistic 
              title={<span style={{ color: '#cf1322', fontWeight: 'bold', fontSize: '15px' }}>Hồ sơ bị từ chối</span>} 
              value={stats.rejected} 
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />} 
              valueStyle={{ color: '#820014', fontWeight: 900, fontSize: '30px' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* KHU VỰC BIỂU ĐỒ TRỰC QUAN */}
      <Row gutter={[24, 24]} style={{ marginBottom: 28 }}>
        {/* Biểu đồ cột */}
        <Col xs={24} lg={14}>
          <Card 
            title={<span style={{ color: '#004b87', fontWeight: 'bold', fontSize: '16px' }}>Biểu đồ số lượng trạng thái hồ sơ</span>} 
            bordered={false} 
            style={{ borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                  <XAxis dataKey="name" stroke="#718096" />
                  <YAxis allowDecimals={false} stroke="#718096" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#004b87" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Biểu đồ tròn (Tỷ lệ) */}
        <Col xs={24} lg={10}>
          <Card 
            title={<span style={{ color: '#004b87', fontWeight: 'bold', fontSize: '16px' }}>Tỷ lệ trạng thái xử lý hồ sơ</span>} 
            bordered={false} 
            style={{ borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ width: '100%', height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* BẢNG DANH SÁCH HỒ SƠ MỚI NHẤT */}
      <Card 
        title={<span style={{ color: '#004b87', fontWeight: 'bold', fontSize: '16px' }}>Danh sách hồ sơ mới nhất</span>} 
        bordered={false} 
        style={{ borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 30 }}
        styles={{ body: { padding: '0 20px 20px 20px' } }}
      >
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* CỬA SỔ POPUP (MODAL) XEM CHI TIẾT HỒ SƠ */}
      <Modal 
        title={<span style={{ color: '#004b87', fontSize: 18, fontWeight: 'bold' }}>Chi tiết hồ sơ đăng ký dịch vụ</span>} 
        open={isModalVisible} 
        onCancel={handleCancel}
        footer={[
          <Button key="close" type="primary" onClick={handleCancel} style={{ background: '#004b87', borderRadius: 6 }}>
            Đóng
          </Button>
        ]}
        width={700}
        centered
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="middle" style={{ marginTop: 15 }}>
            <Descriptions.Item label="Mã hồ sơ"><b style={{ color: '#004b87' }}>{selectedOrder.orderCode}</b></Descriptions.Item>
            <Descriptions.Item label="Họ tên khách hàng">{selectedOrder.customerName || '---'}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedOrder.phone || '---'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ lắp đặt">{selectedOrder.address || '---'}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedOrder.note || 'Không có ghi chú'}</Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : ''}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedOrder.status?.toUpperCase() === 'REJECTED' ? 'error' : (selectedOrder.status?.toUpperCase() === 'APPROVED' ? 'success' : 'warning')} style={{ borderRadius: 6, padding: '2px 10px' }}>
                {selectedOrder.status?.toUpperCase() === 'REJECTED' ? 'Từ chối' : (selectedOrder.status?.toUpperCase() === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt')}
              </Tag>
            </Descriptions.Item>
            
            {selectedOrder.status?.toUpperCase() === 'REJECTED' && (
              <Descriptions.Item label={<span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>Lý do từ chối</span>}>
                <span style={{ color: '#ff4d4f' }}>{selectedOrder.rejectReason || 'Không có lý do cụ thể'}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;