import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space, Popconfirm, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // State lưu ảnh xem trước
  const [form] = Form.useForm();

  const apiUrl = 'https://localhost:7158/api/Products';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error(error);
      message.error('Không thể lấy danh sách dịch vụ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
      setImagePreview(record.imageUrl || ''); // Nạp ảnh cũ vào khung xem trước
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true });
      setImagePreview(''); // Xóa ảnh xem trước
    }
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      const payload = { ...values, imageUrl: values.imageUrl || '' };
      
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, payload);
        message.success('Cập nhật dịch vụ thành công!');
      } else {
        await axios.post(apiUrl, payload);
        message.success('Thêm dịch vụ mới thành công!');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi lưu dịch vụ!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/${id}`);
      message.success('Đã xóa dịch vụ!');
      fetchProducts();
    } catch (error) {
      console.error(error);
      message.error('Không thể xóa dịch vụ này!');
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình các cột của bảng
  const columns = [
    { 
      title: 'Hình ảnh', 
      dataIndex: 'imageUrl', 
      key: 'imageUrl',
      render: (imageUrl) => (
        imageUrl ? 
        <img src={imageUrl} alt="Sản phẩm" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #d9d9d9' }} /> : 
        <div style={{ width: 60, height: 60, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
           <PictureOutlined style={{ color: '#bfbfbf', fontSize: 20 }} />
        </div>
      )
    },
    { title: 'Mã DV', dataIndex: 'code', key: 'code', fontWeight: 'bold' },
    { title: 'Tên sản phẩm/dịch vụ', dataIndex: 'name', key: 'name' },
    { 
      title: 'Danh mục', 
      dataIndex: 'category', 
      key: 'category',
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    { 
      title: 'Giá cước', 
      dataIndex: 'price', 
      key: 'price',
      render: (price) => <strong style={{ color: '#f5222d' }}>{price.toLocaleString('vi-VN')} đ</strong> 
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Đang kinh doanh' : 'Tạm ngưng'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa dịch vụ này?" onConfirm={() => handleDelete(record.id)} okText="Có" cancelText="Không">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Quản lý Danh mục Dịch vụ VNPT</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm sản phẩm/dịch vụ
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="id" 
        loading={loading} 
        scroll={{ x: 'max-content' }} 
      />

      <Modal 
        title={editingId ? "Chỉnh sửa thông tin" : "Thêm sản phẩm/dịch vụ mới"}
        open={isModalVisible} 
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          
          {/* KHU VỰC TẢI ẢNH TỪ MÁY TÍNH */}
          <Form.Item label="Hình ảnh sản phẩm">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                // Kiểm tra định dạng và dung lượng
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('Chỉ hỗ trợ file JPG hoặc PNG!');
                  return Upload.LIST_IGNORE;
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  message.error('Ảnh phải nhỏ hơn 2MB!');
                  return Upload.LIST_IGNORE;
                }
                
                // Đọc file và chuyển thành dạng Base64
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  setImagePreview(reader.result); // Hiện ảnh xem trước
                  form.setFieldsValue({ imageUrl: reader.result }); // Gán dữ liệu ẩn vào form
                };
                return false; // Ngăn không cho Upload tự động gọi API
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Input ẩn để lưu chuỗi Base64 của ảnh */}
          <Form.Item name="imageUrl" hidden>
            <Input />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="code" label="Mã (VD: SMW-01)" rules={[{ required: true, message: 'Nhập mã!' }]}>
              <Input />
            </Form.Item>
            
            <Form.Item name="name" label="Tên sản phẩm/dịch vụ" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục!' }]}>
            <Select placeholder="Chọn danh mục...">
              <Option value="Đồng hồ thông minh">Đồng hồ thông minh</Option>
              <Option value="Sim số">Sim số</Option>
              <Option value="Thiết bị Wifi / Router">Thiết bị Wifi / Router</Option>
              <Option value="Internet Cáp Quang">Internet Cáp Quang</Option>
              <Option value="Chữ ký số (VNPT-CA)">Chữ ký số (VNPT-CA)</Option>
              <Option value="Dịch vụ khác">Dịch vụ khác</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="price" label="Giá bán / Giá cước (VNĐ)" rules={[{ required: true, message: 'Nhập giá!' }]}>
              <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>

            <Form.Item name="isActive" label="Trạng thái">
              <Select>
                <Option value={true}>Đang kinh doanh</Option>
                <Option value={false}>Tạm ngưng</Option>
              </Select>
            </Form.Item>
          </div>

          {/* TRƯỜNG NHẬP MÔ TẢ CHI TIẾT MỚI ĐƯỢC THÊM VÀO */}
          <Form.Item 
            name="description" 
            label="Mô tả chi tiết sản phẩm / gói cước"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Nhập mô tả chi tiết. Khuyên dùng: Mỗi tính năng một dòng (Bấm Enter xuống dòng) để khách hàng dễ đọc." 
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', margin: 0, marginTop: 16 }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingId ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;