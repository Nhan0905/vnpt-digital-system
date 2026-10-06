import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Gửi dữ liệu xuống API Backend
      await axios.post('https://localhost:7158/api/Users/register', values);
      
      message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/'); // Chuyển về trang đăng nhập
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
      <Card style={{ width: 700, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ color: '#1890ff', margin: 0, textTransform: 'uppercase' }}>Đăng ký tài khoản</Title>
          <Text type="secondary">Cổng dịch vụ khách hàng VNPT</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          {/* Row 1: Tài khoản & Mật khẩu */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="username" rules={[{ required: true, message: 'Nhập tên đăng nhập!' }]}>
                <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Tên đăng nhập (VD: Nv1)" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Mật khẩu" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: Họ tên & Giới tính */}
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item name="fullName" rules={[{ required: true, message: 'Nhập họ và tên!' }]}>
                <Input prefix={<IdcardOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Họ và tên của bạn" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="gender" rules={[{ required: true, message: 'Chọn giới tính!' }]}>
                <Select placeholder="Giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: CCCD & Số điện thoại */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="cccd" rules={[{ required: true, message: 'Nhập số CC/CCCD!' }]}>
                <Input prefix={<IdcardOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Số CC/CCCD" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4: Email */}
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ!' }]}>
            <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Email cá nhân" />
          </Form.Item>

          {/* Row 5: Tỉnh/Thành & Quận/Huyện */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="province" rules={[{ required: true, message: 'Nhập Tỉnh/Thành!' }]}>
                <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }}/>} placeholder="Tỉnh thành (VD: An Giang)" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="district" rules={[{ required: true, message: 'Nhập Quận/Huyện!' }]}>
                <Input placeholder="Quận huyện (VD: TX Tân Châu)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 6: Địa chỉ cụ thể */}
          <Form.Item name="address" rules={[{ required: true, message: 'Nhập địa chỉ cụ thể!' }]}>
            <Input placeholder="Địa chỉ cụ thể (VD: 180, P. Long Hưng...)" />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block style={{ height: 45, fontSize: 16, fontWeight: 'bold' }} loading={loading}>
              Đăng ký ngay
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>Đã có tài khoản? </Text>
            <Button type="link" onClick={() => navigate('/')} style={{ padding: 0 }}>Đăng nhập tại đây</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;