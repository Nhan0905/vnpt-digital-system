import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col, Table, Typography, Popconfirm, AutoComplete } from 'antd';
import { ShopOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const AdminStores = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Lấy danh sách điểm giao dịch từ Backend
  const fetchStores = async () => {
    try {
      setTableLoading(true);
      const response = await axios.get('https://localhost:7158/api/Stores');
      setStores(response.data.data || response.data || []);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách điểm giao dịch!");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Thêm điểm giao dịch mới
  const handleAddStore = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await axios.post('https://localhost:7158/api/Stores', values, {
        headers: { Authorization: `Bearer ${token}` }
      });

      message.success('Thêm điểm giao dịch mới thành công!');
      form.resetFields();
      fetchStores(); 
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm điểm giao dịch!');
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XÓA ĐIỂM GIAO DỊCH ---
  const handleDeleteStore = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7158/api/Stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Đã xóa điểm giao dịch thành công!');
      fetchStores(); // Tải lại bảng sau khi xóa
    } catch (error) {
      console.error(error);
      message.error('Không thể xóa điểm giao dịch này!');
    }
  };

  const columns = [
    { title: 'Tên điểm giao dịch', dataIndex: 'name', key: 'name', render: (text) => <b>{text}</b> },
    { title: 'Khu vực (Tỉnh/TP)', dataIndex: 'province', key: 'province' },
    { title: 'Quận/Huyện', dataIndex: 'district', key: 'district' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa điểm giao dịch này không?"
          onConfirm={() => handleDeleteStore(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ color: '#005baa', marginBottom: 20 }}>
        <ShopOutlined /> Quản lý Hệ thống Điểm giao dịch VNPT
      </Title>

      <Row gutter={24}>
        {/* Cột bên trái: Form thêm điểm giao dịch */}
        <Col xs={24} lg={10}>
          <Card title="Thêm điểm giao dịch mới" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 20 }}>
            <Form form={form} layout="vertical" onFinish={handleAddStore}>
              <Form.Item name="name" label="Tên điểm giao dịch" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input placeholder="VD: Trung tâm Giao dịch VNPT Quận 1" size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  {/* SỬ DỤNG AUTOCOMPLETE THAY VÌ SELECT */}
                  <Form.Item name="province" label="Mã Tỉnh/TP" rules={[{ required: true, message: 'Vui lòng nhập mã Tỉnh/TP!' }]}>
                    <AutoComplete
                      placeholder="Nhập mã (VD: ag, dn, ct...)"
                      size="large"
                      options={[
                        { value: 'ag', label: 'An Giang (ag)' },
                        { value: 'hcm', label: 'Hồ Chí Minh (hcm)' },
                        { value: 'hn', label: 'Hà Nội (hn)' },
                        { value: 'dn', label: 'Đà Nẵng (dn)' },
                        { value: 'ct', label: 'Cần Thơ (ct)' }
                      ]}
                      filterOption={(inputValue, option) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase()) || 
                        option.value.toLowerCase().includes(inputValue.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="district" label="Mã Quận/Huyện" rules={[{ required: true, message: 'Nhập mã quận!' }]}>
                    <Input placeholder="VD: lx, q1, hk" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}>
                <Input placeholder="VD: 121 Pasteur, Quận 1" size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT!' }]}>
                    <Input placeholder="VD: 028 3822 8888" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="mapEmbed" label="Link Nhúng Google Map (src)" rules={[{ required: true, message: 'Nhập link map!' }]}>
                    <Input placeholder="Dán link src trong iframe Google Maps" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />} loading={loading} style={{ background: '#005baa', width: '100%' }}>
                  Thêm Điểm Giao Dịch
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Cột bên phải: Bảng danh sách kèm nút Xóa */}
        <Col xs={24} lg={14}>
          <Card title="Danh sách điểm giao dịch hiện có" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table 
              dataSource={stores} 
              columns={columns} 
              rowKey="id" 
              loading={tableLoading} 
              pagination={{ pageSize: 5 }} 
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStores;