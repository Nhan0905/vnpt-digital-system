import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Carousel, Row, Col, Tag } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  GlobalOutlined, 
  SafetyCertificateOutlined, 
  WifiOutlined, 
  RocketOutlined, 
  CheckCircleFilled 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('https://localhost:7158/api/Users/login', values);
      const data = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('fullName', data.fullName);
      
      message.success('Đăng nhập hệ thống thành công!');
      
      if (data.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'Staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/customer-portal');
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    // THIẾT LẬP ẢNH NỀN PHỦ KÍN 100% MÀN HÌNH
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // Dùng ảnh nền công nghệ kết hợp lớp phủ gradient xanh đậm để làm nổi bật Form
      backgroundImage: `linear-gradient(135deg, rgba(0, 34, 68, 0.85) 0%, rgba(0, 75, 135, 0.7) 100%), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden' 
    }}>
      <Card 
        bordered={false} 
        style={{ 
          width: '100%', 
          maxWidth: 1000, 
          margin: '0 20px', 
          borderRadius: 20, 
          overflow: 'hidden', 
          // Tăng độ đổ bóng (shadow) để ô đăng nhập tách biệt hoàn toàn khỏi ảnh nền
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)' 
        }} 
        styles={{ body: { padding: 0 } }}
      >
        <Row style={{ minHeight: 520, alignItems: 'stretch' }}>
          
          {/* CỘT TRÁI: QUẢNG CÁO & KHUYẾN MÃI */}
          <Col xs={0} md={12} style={{ 
            background: 'linear-gradient(135deg, #003366 0%, #004b87 100%)', 
            padding: '40px 35px', 
            color: '#fff', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            borderRight: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 20 }}>
                <GlobalOutlined style={{ fontSize: '28px', color: '#63b3ed' }} />
                <span style={{ fontSize: '20px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '1px' }}>VNPT DIGITAL</span>
              </div>
              <Tag color="cyan" style={{ borderRadius: 6, padding: '4px 12px', fontWeight: 'bold', marginBottom: 15 }}>SIÊU ƯU ĐÃI 2026</Tag>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
              <Carousel autoplay effect="fade" dotPosition="bottom">
                <div>
                  <div style={{ paddingBottom: '30px' }}>
                    <Title level={3} style={{ color: '#fff', fontWeight: 800, marginBottom: 12 }}>
                      <WifiOutlined style={{ marginRight: 8, color: '#63b3ed' }} /> Cáp Quang Wifi 6
                    </Title>
                    <Paragraph style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      Đăng ký ngay các gói cước Internet tốc độ cao, nhận ngay Modem Wifi 6 thế hệ mới miễn phí 100%. Phủ sóng toàn diện mọi góc nhà!
                    </Paragraph>
                  </div>
                </div>

                <div>
                  <div style={{ paddingBottom: '30px' }}>
                    <Title level={3} style={{ color: '#fff', fontWeight: 800, marginBottom: 12 }}>
                      <RocketOutlined style={{ marginRight: 8, color: '#f6ad55' }} /> Chuyển Mạng Giữ Số
                    </Title>
                    <Paragraph style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      Giữ nguyên số di động cũ, tận hưởng kho Data khổng lồ và các đặc quyền ưu đãi độc quyền từ mạng di động VinaPhone.
                    </Paragraph>
                  </div>
                </div>

                <div>
                  <div style={{ paddingBottom: '30px' }}>
                    <Title level={3} style={{ color: '#fff', fontWeight: 800, marginBottom: 12 }}>
                      <SafetyCertificateOutlined style={{ marginRight: 8, color: '#68d391' }} /> Hệ Sinh Thái Số
                    </Title>
                    <Paragraph style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      Quản lý dịch vụ, thanh toán cước trực tuyến, tích điểm đổi quà và tra cứu hóa đơn tiện lợi chỉ với 1 tài khoản duy nhất.
                    </Paragraph>
                  </div>
                </div>
              </Carousel>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 15, fontSize: '13px', color: '#cbd5e0', display: 'flex', justifyContent: 'space-between' }}>
              <span><CheckCircleFilled style={{ color: '#68d391', marginRight: 5 }} /> Hỗ trợ 24/7</span>
              <span>Tổng đài: <strong>18001091</strong></span>
            </div>
          </Col>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
          <Col xs={24} md={12} style={{ padding: '50px 40px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: 35 }}>
              <Title level={2} style={{ color: '#004b87', fontWeight: 900, margin: '0 0 8px 0' }}>ĐĂNG NHẬP</Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>Cổng thông tin quản lý & đăng ký dịch vụ VNPT</Text>
            </div>

            <Form
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#004b87' }} />} 
                  placeholder="Tên đăng nhập" 
                  style={{ borderRadius: 8, height: 48 }} 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#004b87' }} />} 
                  placeholder="Mật khẩu" 
                  style={{ borderRadius: 8, height: 48 }} 
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 20, marginTop: 10 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  style={{ 
                    width: '100%', 
                    height: 48, 
                    borderRadius: 8, 
                    background: '#004b87', 
                    borderColor: '#004b87', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(0, 75, 135, 0.25)'
                  }}
                >
                  Đăng nhập hệ thống
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 25 }}>
                <Text type="secondary">Bạn là khách hàng mới? </Text>
                <a 
                  onClick={() => navigate('/register')} 
                  style={{ color: '#004b87', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Đăng ký tài khoản ngay
                </a>
              </div>
            </Form>
          </Col>

        </Row>
      </Card>
    </div>
  );
};

export default Login;