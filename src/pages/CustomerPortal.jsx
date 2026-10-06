import React, { useState, useEffect, useRef } from 'react';
import { Layout, Input, Select, Typography, Row, Col, Card, Button, Divider, Empty, Modal, Space, Dropdown, Carousel, Form, message, Upload, Table, Tag, List, AutoComplete, Avatar, Descriptions, Badge } from 'antd';
import { 
  SearchOutlined, GlobalOutlined,
  MobileOutlined, WifiOutlined, PhoneOutlined, CustomerServiceOutlined, 
  ShopOutlined, PhoneFilled, MailFilled, VerifiedOutlined, MobileTwoTone, TagFilled, RightOutlined,
  WifiOutlined as WifiIcon, PhoneTwoTone, ShopTwoTone, ContactsTwoTone, SyncOutlined, UserOutlined, LogoutOutlined,
  UploadOutlined, HistoryOutlined, EditOutlined, PictureOutlined, EnvironmentFilled, PlusCircleOutlined,
  BellOutlined, InfoCircleOutlined, CheckCircleFilled, MessageOutlined, CloseOutlined, RobotOutlined, SendOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LockOutlined, StopOutlined, WarningOutlined, } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CustomerPortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('HOME'); 
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // --- STATE QUẢN LÝ FORM ĐĂNG KÝ & UPLOAD CCCD ---
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderForm] = Form.useForm();

  // --- STATE MODAL CHI TIẾT GÓI CƯỚC TỪ BACKEND ---
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentDetailPkg, setCurrentDetailPkg] = useState(null);
  
  // --- STATE QUẢN LÝ LỊCH SỬ ĐƠN HÀNG & CẬP NHẬT ---
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null); 

  // --- STATE QUẢN LÝ THÔNG TIN TÀI KHOẢN (PROFILE) ---
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  // --- STATE HỖ TRỢ & TICKET BÁO HỎNG ---
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [supportModalType, setSupportModalType] = useState(''); 
  const [selectedProvince, setSelectedProvince] = useState('ag');
  const [storeSearchResults, setStoreSearchResults] = useState([]);
  const [hasSearchedStore, setHasSearchedStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketForm] = Form.useForm();

  // --- STATE THÔNG BÁO & LỊCH SỬ TICKET PHẢN HỒI ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMyTicketsModalVisible, setIsMyTicketsModalVisible] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // --- STATE CHATBOT AI ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Mình là trợ lý ảo VNPT. Mình có thể tư vấn gói cước, hỗ trợ báo hỏng hoặc giải đáp thắc mắc cho bạn. Bạn cần giúp gì ạ?' }
  ]);

  // --- BANNER CHUẨN THƯƠNG HIỆU VNPT ---
  const adBanners = [
    {
      title: "VNPT - NỘI ĐÔ SỐ & VIỄN THÔNG",
      desc: "Trải nghiệm tốc độ đỉnh cao cùng các gói cước ưu đãi độc quyền dành riêng cho bạn",
      gradient: "linear-gradient(135deg, #004b87 0%, #0072bc 50%, #00a8cc 100%)"
    },
    {
      title: "SIÊU ƯU ĐÃI CÁP QUANG MÙA HÈ",
      desc: "Đăng ký Internet tốc độ cao nhận ngay Modem Wifi 6 thế hệ mới miễn phí 100%",
      gradient: "linear-gradient(135deg, #003366 0%, #005baa 100%)"
    },
    {
      title: "CHUYỂN MẠNG GIỮ SỐ - NHANH CHÓNG",
      desc: "Giữ nguyên số di động cũ, tận hưởng kho Data khổng lồ và ưu đãi cực khủng từ VinaPhone",
      gradient: "linear-gradient(135deg, #b0125d 0%, #d81b60 100%)"
    }
  ];

  const newsList = [
    { 
      title: "VNPT Tặng ngay 50% dung lượng Data khi đăng ký gói cước mới trong tháng", 
      date: "17/09/2026", 
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      title: "Ra mắt gói cước gia đình siêu tiết kiệm Home Combo tích hợp Internet & Truyền hình", 
      date: "15/09/2026", 
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      title: "Cảnh báo thủ đoạn lừa đảo giả mạo nhân viên VNPT nâng cấp SIM 5G qua điện thoại", 
      date: "10/09/2026", 
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" 
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('fullName');
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Khách hàng');
      fetchNotifications();
    }
    fetchProducts();
  }, []);

  // Cuộn xuống cuối tin nhắn mới nhất
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/'); 
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get('https://localhost:7158/api/Orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orders = response.data.data || response.data || [];
      
      const notifs = orders.map(order => {
        const pkgName = order.productCode || order.productName || order.packageName || order.code || 'Dịch vụ VNPT';
        let statusText = 'Đang chờ duyệt';
        let statusColor = 'orange';
        if (order.status === 'Approved' || order.status === 'Đã duyệt') {
          statusText = 'Đã được duyệt thành công 🎉';
          statusColor = 'green';
        } else if (order.status === 'Rejected' || order.status === 'Từ chối') {
          statusText = `Bị từ chối ❌ (${order.rejectReason || 'Không có lý do'})`;
          statusColor = 'red';
        }
        return {
          id: order.id,
          title: `Hồ sơ gói: ${pkgName}`,
          time: order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '',
          statusText,
          statusColor
        };
      });

      setNotifications(notifs);

      const totalProcessed = notifs.filter(n => n.statusColor !== 'orange').length;
      const currentUser = localStorage.getItem('fullName') || 'Guest';
      const previouslyRead = parseInt(localStorage.getItem(`readNotifCount_${currentUser}`) || '0', 10);
      setUnreadCount(Math.max(0, totalProcessed - previouslyRead));

    } catch (error) {
      console.error("Lỗi tải thông báo hồ sơ", error);
    }
  };

  const fetchMyTickets = async () => {
    try {
      setTicketsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7158/api/SupportTickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyTickets(response.data.data || []);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải lịch sử yêu cầu hỗ trợ!');
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleOpenMyTickets = () => {
    setIsMyTicketsModalVisible(true);
    fetchMyTickets();
  };

  const myTicketColumns = [
    { title: 'Tiêu đề sự cố', dataIndex: 'title', key: 'title', render: (text) => <b style={{ color: '#004b87' }}>{text}</b> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName', render: (name) => <b>{name || userName}</b> },
    { title: 'Ngày gửi', dataIndex: 'createdAt', key: 'createdAt', render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '---' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (val) => {
        let color = val === 'Đã hoàn thành' ? 'success' : val === 'Đang xử lý' ? 'warning' : 'error';
        return <Tag color={color} style={{ borderRadius: 6, padding: '2px 10px' }}>{val || 'Chờ tiếp nhận'}</Tag>;
      }
    },
    { title: 'Kỹ thuật viên phụ trách', dataIndex: 'assignedTechnician', key: 'assignedTechnician', render: (val) => val ? <Tag color="blue">{val}</Tag> : <Text type="secondary">Chưa phân công</Text> }
  ];

  const handleOpenProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7158/api/Users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
      setIsProfileModalVisible(true);
    } catch (error) {
      console.error("Lỗi lấy thông tin cá nhân:", error);
      message.error("Không thể tải thông tin tài khoản!");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7158/api/Products');
      setPackages(response.data.data || response.data || []);
    } catch (error) {
      console.error("Lỗi tải gói cước", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7158/api/Orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setIsHistoryModalVisible(true);
    fetchMyOrders();
  };

  const handleOpenDetailModal = (pkg) => {
    setCurrentDetailPkg(pkg);
    setIsDetailModalVisible(true);
  };

  const handleProceedToOrder = () => {
    setIsDetailModalVisible(false);
    handleOpenOrderForm(currentDetailPkg);
  };

  const handleOpenOrderForm = (pkg) => {
    if (!isLoggedIn) {
      message.warning('Vui lòng Đăng nhập để đăng ký dịch vụ!');
      return;
    }
    setEditingOrderId(null); 
    setSelectedPackage(pkg);
    orderForm.setFieldsValue({
      customerName: userName,
      note: `Tôi muốn đăng ký gói cước: ${pkg.code}`
    });
    setIsOrderModalVisible(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrderId(order.id);
    setSelectedPackage({ code: order.productCode }); 
    orderForm.setFieldsValue({
      customerName: userName,
      phone: order.phone,
      address: order.address,
      note: order.note
    });
    setIsOrderModalVisible(true);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const handleSubmitOrder = async (values) => {
    try {
      setOrderLoading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      if (!editingOrderId) formData.append('productId', selectedPackage.id);
      formData.append('customerName', values.customerName);
      formData.append('phone', values.phone);
      formData.append('address', values.address);
      formData.append('note', values.note || '');
      
      if (values.cccdFront && values.cccdFront.length > 0) {
        formData.append('cccdFront', values.cccdFront[0].originFileObj);
      }
      if (values.cccdBack && values.cccdBack.length > 0) {
        formData.append('cccdBack', values.cccdBack[0].originFileObj);
      }

      if (editingOrderId) {
        await axios.put(`https://localhost:7158/api/Orders/${editingOrderId}/resubmit`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        message.success('Đã cập nhật hồ sơ thành công!');
        fetchMyOrders(); 
      } else {
        await axios.post('https://localhost:7158/api/Orders', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        message.success(`Đăng ký thành công! Hồ sơ đang chờ duyệt.`);
      }

      setIsOrderModalVisible(false);
      orderForm.resetFields();
      fetchNotifications();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleOpenTicketModal = () => {
    if (!isLoggedIn) {
      message.warning('Vui lòng đăng nhập để gửi yêu cầu hỗ trợ!');
      return;
    }
    ticketForm.setFieldsValue({ customerName: userName });
    setIsTicketModalVisible(true);
  };

  const handleSubmisionTicket = async (values) => {
    try {
      setTicketLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('phone', values.phone);
      formData.append('customerName', values.customerName);

      if (values.issueImage && values.issueImage.length > 0) {
        formData.append('issueImage', values.issueImage[0].originFileObj);
      }

      await axios.post('https://localhost:7158/api/SupportTickets', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      message.success('Đã gửi yêu cầu hỗ trợ thành công! Kỹ thuật viên sẽ liên hệ lại sớm.');
      setIsTicketModalVisible(false);
      ticketForm.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Không thể gửi yêu cầu hỗ trợ!');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleSearchStores = async (provinceVal = selectedProvince) => {
    if (!provinceVal || provinceVal.trim() === '') {
      message.warning('Vui lòng nhập mã Tỉnh/Thành phố cần tìm!');
      return;
    }
    
    setHasSearchedStore(true);
    try {
      const response = await axios.get(`https://localhost:7158/api/Stores?province=${provinceVal}`);
      const data = response.data.data || response.data || [];
      setStoreSearchResults(data);
      setSelectedStore(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Lỗi tải điểm giao dịch:", error);
      setStoreSearchResults([]);
      setSelectedStore(null);
    }
  };

  const showSupportModal = (type) => {
    setSupportModalType(type);
    if (type === 'STORE') {
      handleSearchStores('ag'); 
    }
    setIsSupportModalVisible(true);
  };

  // --- LOGIC GỌI API GEMINI AI CHATBOT THẬT ---
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    // 1. In câu hỏi của người dùng lên khung chat
    setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');

    // 2. In thêm dòng chữ "Đang suy nghĩ..." để giao diện mượt mà
    setChatMessages(prev => [...prev, { sender: 'bot', text: 'Đang kiểm tra thông tin, bạn đợi xíu nhé...' }]);

    try {
      // 3. Gọi trực tiếp xuống API Chatbot ở Backend (.NET Core)
      const response = await axios.post('https://localhost:7158/api/Chatbot', { 
        message: userMessage 
      });

      const botReply = response.data.reply;
      
      // 4. Thay thế dòng "Đang suy nghĩ..." bằng câu trả lời thực tế từ AI
      setChatMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { sender: 'bot', text: botReply };
        return newMsgs;
      });

    } catch (error) {
      console.error("Lỗi gọi AI Chatbot", error);
      setChatMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { sender: 'bot', text: 'Xin lỗi bạn, trợ lý AI đang mất kết nối. Bạn vui lòng gọi tổng đài 18001091 để được hỗ trợ nhé!' };
        return newMsgs;
      });
    }
  };

  const getMenuItemStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
      cursor: 'pointer',
      padding: '10px 24px',
      borderRadius: '10px',
      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
      border: isActive ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
      boxShadow: isActive ? '0 6px 20px rgba(0, 0, 0, 0.15)' : 'none',
      transform: isActive ? 'translateY(-2px)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  const renderSupportModalContent = () => {
    switch (supportModalType) {
      case 'CONTACT':
        return (
          <div style={{ fontSize: 15, lineHeight: '1.8', color: '#2d3748' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 40, color: '#004b87', marginBottom: 10 }}>
                <CustomerServiceOutlined />
              </div>
              <p style={{ fontSize: 16, color: '#4a5568' }}>
                Để được hỗ trợ nhanh chóng và tốt nhất, Quý khách vui lòng liên hệ với VNPT qua các kênh chính thức dưới đây:
              </p>
            </div>

            <div style={{ background: '#f8fbff', padding: '20px 25px', borderRadius: '12px', border: '1px solid #edf2f7' }}>
              {/* Nhóm Hotline */}
              <h4 style={{ color: '#004b87', marginTop: 0, marginBottom: 15, borderBottom: '2px solid #edf2f7', paddingBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
                <PhoneFilled style={{ marginRight: 8 }} /> Hotline Hỗ trợ (24/7)
              </h4>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, marginBottom: 25 }}>
                <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                  <MobileOutlined style={{ color: '#d81b60', fontSize: 20, marginRight: 12 }} />
                  <span style={{ width: 220 }}>Tổng đài di động VinaPhone:</span> 
                  <strong style={{ color: '#d81b60', fontSize: 18 }}>18001091</strong> 
                  <Tag color="magenta" style={{ marginLeft: 10, borderRadius: 10 }}>Miễn phí</Tag>
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <WifiOutlined style={{ color: '#0072bc', fontSize: 20, marginRight: 12 }} />
                  <span style={{ width: 220 }}>Tổng đài Internet & Truyền hình:</span> 
                  <strong style={{ color: '#0072bc', fontSize: 18 }}>18001166</strong>
                  <Tag color="blue" style={{ marginLeft: 10, borderRadius: 10 }}>Miễn phí</Tag>
                </li>
              </ul>

              {/* Nhóm Trực tuyến & Trụ sở */}
              <h4 style={{ color: '#004b87', marginTop: 0, marginBottom: 15, borderBottom: '2px solid #edf2f7', paddingBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
                <GlobalOutlined style={{ marginRight: 8 }} /> Thông tin Khác
              </h4>
              <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                <li style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start' }}>
                  <MailFilled style={{ color: '#38a169', fontSize: 18, marginRight: 12, marginTop: 4 }} />
                  <div>
                    <strong>Email CSKH:</strong> <br/>
                    <a href="mailto:cskh@vnpt.vn" style={{ color: '#3182ce', fontWeight: 500 }}>cskh@vnpt.vn</a>
                  </div>
                </li>
                <li style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start' }}>
                  <MessageOutlined style={{ color: '#004b87', fontSize: 18, marginRight: 12, marginTop: 4 }} />
                  <div>
                    <strong>Mạng xã hội:</strong> <br/>
                    <span style={{ color: '#4a5568' }}>Zalo OA: VNPT VinaPhone | Fanpage: VNPT</span>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EnvironmentFilled style={{ color: '#e53e3e', fontSize: 18, marginRight: 12, marginTop: 4 }} />
                  <div>
                    <strong>Trụ sở chính:</strong> <br/>
                    <span style={{ color: '#4a5568' }}>Tòa nhà VNPT, Số 57 Huỳnh Thúc Kháng, Phường Láng Hạ, Quận Đống Đa, TP. Hà Nội.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      case 'STORE':
        const getSafeMapUrl = (store) => {
          if (!store) return "";
          let embed = store.mapEmbed ? store.mapEmbed.trim() : "";
          if (embed.includes('<iframe')) {
            const match = embed.match(/src="([^"]+)"/);
            if (match && match[1]) embed = match[1];
          }
          if (embed && !embed.startsWith('http')) embed = 'https://' + embed;
          if (embed.includes('/maps/embed') && embed.startsWith('http')) return embed;
          const query = encodeURIComponent(store.address || store.name || 'VNPT');
          return `https://maps.google.com/maps?q=${query}&output=embed`;
        };

        return (
          <div>
            <p style={{ marginBottom: 15 }}>Tra cứu điểm giao dịch VNPT gần bạn nhất theo tỉnh thành:</p>
            <Space size="middle" wrap style={{ width: '100%', marginBottom: 20 }}>
              <AutoComplete
                value={selectedProvince}
                onChange={(val) => setSelectedProvince(val)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchStores(selectedProvince); }}
                style={{ width: 260 }}
                size="large"
                placeholder="Nhập mã (VD: ag, hcm, hn...)"
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
              <Button type="primary" size="large" icon={<SearchOutlined />} onClick={() => handleSearchStores(selectedProvince)}>
                Tìm kiếm
              </Button>
            </Space>

            {hasSearchedStore && (
              <Row gutter={16} style={{ marginTop: 20 }}>
                <Col xs={24} md={12}>
                  <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 5 }}>
                    <Title level={5} style={{ color: '#004b87', marginBottom: 12 }}>
                      Kết quả tìm kiếm ({storeSearchResults.length})
                    </Title>
                    {storeSearchResults.length > 0 ? (
                      <List
                        itemLayout="vertical"
                        dataSource={storeSearchResults}
                        renderItem={(item) => {
                          const isSelected = selectedStore && (selectedStore.id ? selectedStore.id === item.id : selectedStore.name === item.name);
                          return (
                            <Card 
                              size="small" 
                              hoverable
                              onClick={() => setSelectedStore(item)}
                              style={{ 
                                marginBottom: 12, 
                                cursor: 'pointer',
                                borderRadius: 10,
                                borderColor: isSelected ? '#004b87' : '#e8e8e8', 
                                borderWidth: isSelected ? 2 : 1,
                                background: isSelected ? '#f0f7ff' : '#ffffff',
                                boxShadow: isSelected ? '0 4px 12px rgba(0, 75, 135, 0.15)' : 'none',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Title level={5} style={{ color: isSelected ? '#004b87' : '#262626', margin: '0 0 6px 0' }}>
                                <ShopOutlined /> {item.name} {isSelected && <span style={{ fontSize: 11, color: '#004b87', fontWeight: 'bold' }}>(Đang chọn)</span>}
                              </Title>
                              <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#555' }}>
                                <EnvironmentFilled style={{ color: '#ff4d4f', marginRight: 5 }} /> {item.address}
                              </p>
                              <p style={{ margin: 0, fontSize: 13, color: '#595959' }}>
                                <PhoneFilled style={{ color: '#52c41a', marginRight: 5 }} /> Hotline: <strong>{item.phone}</strong>
                              </p>
                            </Card>
                          );
                        }}
                      />
                    ) : (
                      <Empty description="Không tìm thấy điểm giao dịch tại khu vực này." />
                    )}
                  </div>
                </Col>

                <Col xs={24} md={12}>
                  <Title level={5} style={{ color: '#004b87', marginBottom: 12 }}>Bản đồ chỉ dẫn</Title>
                  <div style={{ width: '100%', height: 380, borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e8e8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {selectedStore ? (
                      <iframe
                        key={selectedStore.id || selectedStore.name} 
                        title="google-map"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={getSafeMapUrl(selectedStore)}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f9f9f9', flexDirection: 'column', padding: 20, textAlign: 'center' }}>
                        <Text type="secondary">Vui lòng chọn một điểm giao dịch trong danh sách bên trái.</Text>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            )}
          </div>
        );
      case 'NUMBER':
        return (
          <div style={{ fontSize: 15, lineHeight: '1.6', color: '#2d3748' }}>
            
            {/* Header của Modal */}
            <div style={{ textAlign: 'center', marginBottom: 25 }}>
              <div style={{ fontSize: 40, color: '#004b87', marginBottom: 10 }}>
                <SyncOutlined spin={false} />
              </div>
              <p style={{ fontSize: 16, color: '#4a5568' }}>
                Quy định về thời hạn giữ số đối với thuê bao <strong>VinaPhone trả trước</strong> theo chính sách hiện hành:
              </p>
            </div>

            {/* Các bước khóa số */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Bước 1: Khóa 1 chiều */}
              <div style={{ background: '#fff7e6', border: '1px solid #ffd591', padding: '15px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(250, 140, 22, 0.05)' }}>
                <LockOutlined style={{ fontSize: 28, color: '#fa8c16', marginRight: 15 }} />
                <div>
                  <strong style={{ color: '#d46b08', fontSize: 16, display: 'block', marginBottom: 4 }}>Khóa 1 chiều (Chặn gọi đi)</strong>
                  <span style={{ color: '#595959' }}>Tối đa <strong style={{ color: '#fa8c16' }}>10 ngày</strong> kể từ ngày hết hạn thẻ nạp.</span>
                </div>
              </div>

              {/* Bước 2: Khóa 2 chiều */}
              <div style={{ background: '#fff1f0', border: '1px solid #ffa39e', padding: '15px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(245, 34, 45, 0.05)' }}>
                <StopOutlined style={{ fontSize: 28, color: '#f5222d', marginRight: 15 }} />
                <div>
                  <strong style={{ color: '#cf1322', fontSize: 16, display: 'block', marginBottom: 4 }}>Khóa 2 chiều (Chặn gọi đi & đến)</strong>
                  <span style={{ color: '#595959' }}>Tối đa <strong style={{ color: '#f5222d' }}>30 ngày</strong> kể từ thời điểm bị khóa 1 chiều.</span>
                </div>
              </div>

              {/* Bước 3: Thu hồi số */}
              <div style={{ background: '#f5f5f5', border: '1px solid #d9d9d9', padding: '15px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <WarningOutlined style={{ fontSize: 28, color: '#8c8c8c', marginRight: 15 }} />
                <div>
                  <strong style={{ color: '#595959', fontSize: 16, display: 'block', marginBottom: 4 }}>Thu hồi số về kho</strong>
                  <span style={{ color: '#595959' }}>Sau thời hạn khóa 2 chiều nếu khách hàng không nạp tiền/khôi phục.</span>
                </div>
              </div>

            </div>

            {/* Lời khuyên cuối bảng */}
            <div style={{ marginTop: 20, padding: '12px 15px', background: '#e6f7ff', borderRadius: '8px', borderLeft: '4px solid #1890ff', fontSize: 14 }}>
              <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 16 }} />
              <strong>Lời khuyên:</strong> Quý khách vui lòng nạp tiền điện thoại hoặc phát sinh cước thường xuyên để tránh bị gián đoạn liên lạc và mất số nhé!
            </div>
          </div>
        );
      default: return null;
    }
  };

  const historyColumns = [
    { title: 'Gói cước', dataIndex: 'productCode', key: 'productCode', render: (text) => <b style={{ color: '#004b87' }}>{text}</b> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleDateString('vi-VN') },
    { 
      title: 'Trạng thái', 
      key: 'status', 
      render: (_, record) => {
        let color = record.status === 'Approved' || record.status === 'Đã duyệt' ? 'green' : record.status === 'Rejected' || record.status === 'Từ chối' ? 'red' : 'orange';
        let text = record.status === 'Approved' ? 'Đã duyệt' : record.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt';
        return <Tag color={color} style={{ borderRadius: 4, padding: '2px 8px' }}>{text}</Tag>;
      }
    },
    { title: 'Lý do từ chối', dataIndex: 'rejectReason', key: 'rejectReason', render: (text) => <Text type="danger">{text}</Text> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        (record.status === 'Rejected' || record.status === 'Từ chối') && (
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditOrder(record)} style={{ borderRadius: 6 }}>
            Cập nhật lại
          </Button>
        )
      )
    }
  ];

  const getFilteredPackages = () => {
    if (activeTab === 'MOBILE') return packages.filter(p => p.category === 'Sim số' || p.category?.toLowerCase().includes('di động'));
    if (activeTab === 'INTERNET') return packages.filter(p => p.category === 'Internet Cáp Quang' || p.category === 'Thiết bị Wifi / Router' || p.category?.toLowerCase().includes('internet'));
    if (activeTab === 'OTHER') return packages.filter(p => p.category === 'Đồng hồ thông minh' || p.category === 'Chữ ký số (VNPT-CA)' || p.category === 'Dịch vụ khác');
    return [];
  };
  const currentPackages = getFilteredPackages();

  const PackageCard = ({ item }) => {
    const rawImage = item.imageUrl || item.image || item.imagePath || item.filePath;
    let imageUrl = null;
    if (rawImage) {
      if (rawImage.startsWith('http') || rawImage.startsWith('data:image')) {
        imageUrl = rawImage;
      } else {
        const formattedPath = rawImage.startsWith('/') ? rawImage : `/${rawImage}`;
        imageUrl = `https://localhost:7158${formattedPath}`;
      }
    }

    return (
      <Card 
        hoverable 
        style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #eaeaea', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', transition: 'all 0.3s ease' }} 
        styles={{ body: { padding: 20, display: 'flex', flexDirection: 'column', height: '100%' } }}
      >
        <div style={{ textAlign: 'center', color: '#004b87', fontSize: '18px', fontWeight: 'bold', marginBottom: 12 }}>
          {item.code}
        </div>

        <div style={{ height: 160, background: '#f8fbff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, overflow: 'hidden', marginBottom: 15, border: '1px solid #edf2f7' }}>
          {imageUrl ? (
            <img src={imageUrl} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; }} />
          ) : null}
          <div style={{ textAlign: 'center', color: '#a0aec0', display: imageUrl ? 'none' : 'block' }}>
            <PictureOutlined style={{ fontSize: '40px', marginBottom: 6 }} />
            <div style={{ fontSize: '12px', fontWeight: 500 }}>VNPT Smart Product</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 15, flexGrow: 1 }}>
          <Text strong style={{ fontSize: '15px', color: '#2d3748', display: 'block', lineHeight: '1.4' }}>{item.name}</Text>
          <div style={{ color: '#718096', fontSize: '12px', marginTop: 6 }}>Danh mục: {item.category}</div>
        </div>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid #edf2f7', paddingTop: 15 }}>
          <div style={{ marginBottom: 14, color: '#4a5568', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <TagFilled style={{ color: '#0072bc', fontSize: '16px' }} /> 
            <span>Cước phí:</span>
            <span style={{ color: '#d81b60', fontWeight: 'bold', fontSize: '17px' }}>
              {item.price ? item.price.toLocaleString('vi-VN') : '0'} đ
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" shape="round" style={{ background: '#004b87', borderColor: '#004b87', fontWeight: 'bold', height: '40px', width: '100%', boxShadow: '0 4px 12px rgba(0, 75, 135, 0.2)' }} onClick={() => handleOpenDetailModal(item)}>
              XEM CHI TIẾT <InfoCircleOutlined style={{ fontSize: 14 }} />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      
      {/* 1. TOP HEADER HIỆN ĐẠI KÈM CHUÔNG THÔNG BÁO & TICKET */}
      <Header style={{ background: '#ffffff', height: 'auto', padding: '12px 60px', lineHeight: 'normal', borderBottom: '1px solid #edf2f7', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <Row justify="space-between" align="middle">
          <Col style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Title level={3} style={{ color: '#004b87', margin: 0, fontWeight: 900, fontStyle: 'italic', cursor: 'pointer', letterSpacing: '0.5px' }} onClick={() => setActiveTab('HOME')}>
              <GlobalOutlined style={{ marginRight: 8 }} /> VNPT DIGITAL
            </Title>
          </Col>
          <Col style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <Dropdown
                  trigger={['click']}
                  onOpenChange={(open) => {
                    if (open && unreadCount > 0) {
                      setUnreadCount(0);
                      const totalProcessed = notifications.filter(n => n.statusColor !== 'orange').length;
                      const currentUser = localStorage.getItem('fullName') || 'Guest';
                      localStorage.setItem(`readNotifCount_${currentUser}`, totalProcessed.toString());
                    }
                  }}
                  dropdownRender={() => (
                    <Card 
                      title={<span style={{ color: '#004b87', fontWeight: 'bold' }}>Thông báo trạng thái hồ sơ</span>} 
                      style={{ width: 360, boxShadow: '0 6px 20px rgba(0,0,0,0.15)', borderRadius: 12 }}
                      styles={{ body: { maxHeight: 350, overflowY: 'auto', padding: '10px' } }}
                    >
                      {notifications.length > 0 ? (
                        <List
                          itemLayout="vertical"
                          dataSource={notifications}
                          renderItem={(item) => (
                            <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '10px 0' }}>
                              <div style={{ fontWeight: 'bold', color: '#2d3748', fontSize: 14 }}>{item.title}</div>
                              <div style={{ margin: '4px 0', fontSize: 13 }}>
                                Trạng thái: <Tag color={item.statusColor}>{item.statusText}</Tag>
                              </div>
                              <div style={{ fontSize: 11, color: '#a0aec0' }}>{item.time}</div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty description="Chưa có thông báo hồ sơ nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Card>
                  )}
                  placement="bottomRight"
                >
                  <Badge count={unreadCount} overflowCount={99} style={{ cursor: 'pointer' }}>
                    <Button 
                      shape="circle" 
                      icon={<BellOutlined style={{ fontSize: 18, color: '#004b87' }} />} 
                      style={{ border: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                    />
                  </Badge>
                </Dropdown>

                <Dropdown
                  menu={{
                    items: [
                      { key: 'profile', icon: <UserOutlined />, label: 'Thông tin tài khoản', onClick: handleOpenProfile },
                      { key: 'history', icon: <HistoryOutlined />, label: 'Lịch sử đăng ký dịch vụ', onClick: handleOpenHistory },
                      { key: 'tickets', icon: <CustomerServiceOutlined />, label: 'Yêu cầu hỗ trợ & Phản hồi', onClick: handleOpenMyTickets },
                      { type: 'divider' },
                      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout, danger: true },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Button type="text" style={{ fontWeight: 'bold', color: '#004b87', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar size="small" style={{ backgroundColor: '#004b87' }} icon={<UserOutlined />} /> 
                    Xin chào, {userName}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <Button type="primary" shape="round" style={{ background: '#004b87', fontWeight: 'bold', padding: '0 24px' }} onClick={() => navigate('/')}>
                Đăng nhập
              </Button>
            )}
          </Col>
        </Row>
      </Header>

      {/* 2. NAVIGATION BAR XANH ĐẶC TRƯNG */}
      <div style={{ background: 'linear-gradient(90deg, #003366 0%, #004b87 100%)', padding: '16px 60px', display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', boxShadow: '0 4px 12px rgba(0, 51, 102, 0.15)' }}>
        <div onClick={() => setActiveTab('MOBILE')} style={getMenuItemStyle('MOBILE')}>
          <div style={{ fontSize: '26px', marginBottom: '4px' }}><MobileOutlined /></div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>DI ĐỘNG</div>
        </div>
        <div onClick={() => setActiveTab('INTERNET')} style={getMenuItemStyle('INTERNET')}>
          <div style={{ fontSize: '26px', marginBottom: '4px' }}><WifiOutlined /></div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>INTERNET - TRUYỀN HÌNH</div>
        </div>
        <div onClick={() => setActiveTab('OTHER')} style={getMenuItemStyle('OTHER')}>
          <div style={{ fontSize: '26px', marginBottom: '4px' }}><PhoneOutlined /></div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>THIẾT BỊ & DỊCH VỤ KHÁC</div>
        </div>
        <div onClick={() => setActiveTab('SUPPORT')} style={getMenuItemStyle('SUPPORT')}>
          <div style={{ fontSize: '26px', marginBottom: '4px' }}><CustomerServiceOutlined /></div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>HỖ TRỢ</div>
        </div>
      </div>

      <Content>
        {/* TRANG CHỦ */}
        {activeTab === 'HOME' && (
          <>
            <Carousel autoplay effect="fade">
              {adBanners.map((banner, idx) => (
                <div key={idx}>
                  <div style={{ 
                    height: '420px', 
                    background: banner.gradient, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '0 60px'
                  }}>
                    <div>
                      <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: 900, marginBottom: 16, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{banner.title}</h1>
                      <p style={{ fontSize: '18px', opacity: 0.95, maxWidth: 750, margin: '0 auto', lineHeight: '1.6' }}>{banner.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
            
            <div style={{ padding: '60px 80px 40px 80px', background: '#f8fbff' }}>
               <div style={{ textAlign: 'center', marginBottom: 45 }}>
                 <Title level={3} style={{ color: '#004b87', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>TIN TỨC & SỰ KIỆN NỔI BẬT</Title>
                 <div style={{ width: 80, height: 4, background: '#0072bc', margin: '15px auto', borderRadius: 2 }}></div>
               </div>
               <Row gutter={[32, 32]}>
                 {newsList.map((news, index) => (
                   <Col xs={24} sm={8} key={index}>
                     <Card 
                       hoverable 
                       cover={<div style={{ height: 210, backgroundImage: `url(${news.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>}
                       styles={{ body: { padding: '24px 20px', textAlign: 'left' } }}
                       style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #edf2f7', boxShadow: '0 6px 20px rgba(0,0,0,0.04)', transition: 'all 0.3s ease' }}
                     >
                       <Text type="secondary" style={{ display: 'block', marginBottom: 10, fontSize: 13, fontWeight: 500 }}>{news.date}</Text>
                       <Title level={5} style={{ marginTop: 0, minHeight: 50, marginBottom: 15, fontSize: 16, color: '#2d3748', lineHeight: '1.4' }}>{news.title}</Title>
                       <Button type="link" style={{ padding: 0, fontWeight: 'bold', color: '#004b87' }}>Xem chi tiết &gt;</Button>
                     </Card>
                   </Col>
                 ))}
               </Row>
            </div>
          </>
        )}

        {/* TRANG HỖ TRỢ */}
        {activeTab === 'SUPPORT' && (
          <div style={{ padding: '60px 80px', textAlign: 'center', minHeight: '65vh', background: '#f0f5ff' }}>
            <Title level={2} style={{ color: '#004b87', fontWeight: 'bold', margin: 0 }}>Trung Tâm Hỗ Trợ Khách Hàng VNPT</Title>
            <Text type="secondary" style={{ fontSize: 16, marginTop: 8, display: 'block' }}>Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi yêu cầu của quý khách 24/7</Text>
            
            <div style={{ marginTop: 30, marginBottom: 20 }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusCircleOutlined />} 
                onClick={handleOpenTicketModal}
                style={{ background: '#004b87', height: 48, borderRadius: 8, fontWeight: 'bold', padding: '0 30px', boxShadow: '0 4px 12px rgba(0,75,135,0.2)' }}
              >
                Gửi yêu cầu hỗ trợ / Báo hỏng mạng
              </Button>
            </div>

            <Row gutter={[32, 32]} justify="center" style={{ marginTop: 30 }}>
              <Col xs={24} sm={8}>
                <Card hoverable onClick={() => showSupportModal('CONTACT')} style={{ borderColor: '#0072bc', textAlign: 'center', borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0, 114, 188, 0.08)' }} styles={{ body: { padding: 0 } }}>
                  <div style={{ padding: '50px 0', fontSize: '60px' }}><ContactsTwoTone twoToneColor="#004b87" /></div>
                  <div style={{ background: '#fff', borderTop: '1px solid #edf2f7', padding: '18px' }}>
                    <Text strong style={{ color: '#004b87', fontSize: '16px' }}>Thông tin liên hệ <RightOutlined style={{ fontSize: 12 }} /></Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card hoverable onClick={() => showSupportModal('STORE')} style={{ borderColor: '#0072bc', textAlign: 'center', borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0, 114, 188, 0.08)' }} styles={{ body: { padding: 0 } }}>
                  <div style={{ padding: '50px 0', fontSize: '60px' }}><ShopTwoTone twoToneColor="#004b87" /></div>
                  <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '18px' }}>
                    <Text strong style={{ color: '#004b87', fontSize: '16px' }}>Tra cứu Điểm giao dịch <RightOutlined style={{ fontSize: 12 }} /></Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card hoverable onClick={() => showSupportModal('NUMBER')} style={{ borderColor: '#0072bc', textAlign: 'center', borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0, 114, 188, 0.08)' }} styles={{ body: { padding: 0 } }}>
                  <div style={{ padding: '50px 0', fontSize: '60px', color: '#004b87' }}>
                    <SyncOutlined style={{ background: '#e6f7ff', padding: 18, borderRadius: '50%', color: '#004b87' }} />
                  </div>
                  <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '18px' }}>
                    <Text strong style={{ color: '#004b87', fontSize: '16px' }}>Quy định giữ số <RightOutlined style={{ fontSize: 12 }} /></Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* TRANG SẢN PHẨM */}
        {['MOBILE', 'INTERNET', 'OTHER'].includes(activeTab) && (
          <div style={{ padding: '50px 80px', minHeight: '550px', background: '#ffffff' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
               <Title level={3} style={{ color: '#2d3748', fontWeight: 700, textTransform: 'uppercase' }}>
                 {activeTab === 'MOBILE' ? <><MobileTwoTone /> GÓI CƯỚC DI ĐỘNG VINAPHONE</> : 
                  activeTab === 'INTERNET' ? <><WifiIcon style={{ color: '#004b87' }} /> CÁP QUANG INTERNET & TRUYỀN HÌNH</> : 
                  <><PhoneTwoTone /> THIẾT BỊ THÔNG MINH & DỊCH VỤ SỐ</>}
               </Title>
               <div style={{ width: 60, height: 3, background: '#004b87', margin: '15px auto', borderRadius: 2 }}></div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px' }}><Text type="secondary">Đang tải danh mục dịch vụ...</Text></div>
            ) : currentPackages.length > 0 ? (
              <Row gutter={[32, 32]}>
                {currentPackages.map((pkg) => (
                  <Col xs={24} sm={12} md={8} key={pkg.id}>
                    <PackageCard item={pkg} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">Hiện chưa có dịch vụ nào trong danh mục này.</Text>} style={{ margin: '80px 0' }} />
            )}
          </div>
        )}
      </Content>

      {/* KHU VỰC BANNER TRƯỢT TỰ ĐỘNG LẤP ĐẦY KHOẢNG TRỐNG */}
      <div style={{ background: '#f0f5ff', padding: '40px 80px' }}>
        <Carousel autoplay effect="fade" dotPlacement="bottom">
          
          {/* Banner 1: Tải App My VNPT */}
          <div>
            <div style={{ 
              height: 160, 
              background: 'linear-gradient(90deg, #0072bc 0%, #00a8cc 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              borderRadius: 16, boxShadow: '0 8px 24px rgba(0, 114, 188, 0.2)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 30, color: '#fff' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: 20, borderRadius: '50%' }}>
                  <MobileOutlined style={{ fontSize: 45 }} />
                </div>
                <div>
                  <Title level={3} style={{ color: '#fff', margin: '0 0 8px 0', letterSpacing: '1px' }}>TẢI NGAY ỨNG DỤNG MY VNPT</Title>
                  <Text style={{ color: '#fff', fontSize: 16, opacity: 0.9 }}>Quản lý cước, thanh toán hóa đơn và nhận ngàn ưu đãi data mỗi ngày.</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Banner 2: Khuyến mãi */}
          <div>
            <div style={{ 
              height: 160, 
              background: 'linear-gradient(90deg, #d81b60 0%, #ff4081 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              borderRadius: 16, boxShadow: '0 8px 24px rgba(216, 27, 96, 0.2)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 30, color: '#fff' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: 20, borderRadius: '50%' }}>
                  <VerifiedOutlined style={{ fontSize: 45 }} />
                </div>
                <div>
                  <Title level={3} style={{ color: '#fff', margin: '0 0 8px 0', letterSpacing: '1px' }}>ƯU ĐÃI NGẬP TRÀN CHO THUÊ BAO TRẢ TRƯỚC</Title>
                  <Text style={{ color: '#fff', fontSize: 16, opacity: 0.9 }}>Tặng ngay 50% dung lượng Data khi đăng ký các gói cước dài kỳ trong tháng.</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Banner 3: Tổng đài hỗ trợ */}
          <div>
            <div style={{ 
              height: 160, 
              background: 'linear-gradient(90deg, #004b87 0%, #003366 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              borderRadius: 16, boxShadow: '0 8px 24px rgba(0, 75, 135, 0.3)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 30, color: '#fff' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: 20, borderRadius: '50%' }}>
                  <CustomerServiceOutlined style={{ fontSize: 45 }} />
                </div>
                <div>
                  <Title level={3} style={{ color: '#fff', margin: '0 0 8px 0', letterSpacing: '1px' }}>TỔNG ĐÀI CHĂM SÓC KHÁCH HÀNG 24/7</Title>
                  <Text style={{ color: '#fff', fontSize: 16, opacity: 0.9 }}>Sẵn sàng lắng nghe, giải đáp mọi thắc mắc và hỗ trợ kỹ thuật bất cứ lúc nào.</Text>
                </div>
              </div>
            </div>
          </div>

        </Carousel>
      </div>

      <Footer style={{ background: '#002244', color: '#a0aec0', padding: '50px 80px 30px', fontSize: '14px' }}>
        
        {/* 1. Khu vực Liên hệ nhanh (Giữ nguyên biểu tượng) */}
        <Row justify="center" gutter={[60, 40]} style={{ textAlign: 'center' }}>
          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 8 }}><PhoneFilled style={{ fontSize: '24px', color: '#63b3ed' }} /></div>
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>18001091 | 18001166</Text>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ marginBottom: 8 }}><MailFilled style={{ fontSize: '24px', color: '#63b3ed' }} /></div>
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>cskh@vnpt.vn</Text>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ color: '#63b3ed', fontSize: '28px', marginBottom: 6 }}><VerifiedOutlined /></div>
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG</Text>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#2d3748', margin: '40px 0 30px 0' }} />

        {/* 2. Khu vực Thông tin chi tiết VNPT */}
        <Row gutter={[40, 30]}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ color: '#ffffff', marginBottom: 15, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tập đoàn Bưu chính Viễn thông Việt Nam (VNPT)
            </Title>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start' }}>
              <EnvironmentFilled style={{ marginRight: 10, color: '#63b3ed', marginTop: 4 }} />
              <span>Trụ sở chính: Tòa nhà VNPT, Số 57 Huỳnh Thúc Kháng, Phường Láng Hạ, Quận Đống Đa, TP. Hà Nội</span>
            </div>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start' }}>
              <GlobalOutlined style={{ marginRight: 10, color: '#63b3ed', marginTop: 4 }} />
              <span>Mã số doanh nghiệp: 0100684378 do Sở Kế hoạch và Đầu tư TP.Hà Nội cấp ngày 22/10/2018</span>
            </div>
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start' }}>
              <InfoCircleOutlined style={{ marginRight: 10, color: '#63b3ed', marginTop: 4 }} />
              <span>Giấy phép cung cấp dịch vụ Viễn thông số 469/GP-BTTTT do Bộ Thông tin và Truyền thông cấp</span>
            </div>
          </Col>
          
          <Col xs={12} md={6}>
            <Title level={5} style={{ color: '#ffffff', marginBottom: 15 }}>VỀ CHÚNG TÔI</Title>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Giới thiệu VNPT</div>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Tin tức & Sự kiện</div>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Tuyển dụng</div>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Hệ thống Cửa hàng</div>
          </Col>
          
          <Col xs={12} md={6}>
            <Title level={5} style={{ color: '#ffffff', marginBottom: 15 }}>HỖ TRỢ KHÁCH HÀNG</Title>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Chính sách bảo mật</div>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Điều khoản sử dụng</div>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Hướng dẫn đăng ký</div>
            <div style={{ marginBottom: 10, cursor: 'pointer' }} className="footer-link">Giải quyết khiếu nại</div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#2d3748', margin: '30px 0 20px 0' }} />

        {/* 3. Bản quyền */}
        <div style={{ textAlign: 'center', color: '#718096', fontSize: '13px' }}>
          © 2026 Tập đoàn Bưu chính Viễn thông Việt Nam (VNPT). All rights reserved.
        </div>
      </Footer>

      {/* ------------------------------------------------------------- */}
      {/* MODAL CHI TIẾT GÓI CƯỚC */}
      {/* ------------------------------------------------------------- */}
      <Modal open={isDetailModalVisible} onCancel={() => setIsDetailModalVisible(false)} footer={null} width={800} centered styles={{ body: { padding: 0 } }} closeIcon={<span style={{ color: '#fff', fontSize: 20 }}>X</span>}>
        {currentDetailPkg && (() => {
          const rawImage = currentDetailPkg.imageUrl || currentDetailPkg.image || currentDetailPkg.imagePath || currentDetailPkg.filePath;
          let imageUrl = null;
          if (rawImage) {
            if (rawImage.startsWith('http') || rawImage.startsWith('data:image')) imageUrl = rawImage;
            else imageUrl = `https://localhost:7158${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;
          }
          return (
            <Row>
              <Col xs={24} md={10} style={{ background: '#f8fbff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', borderRight: '1px solid #edf2f7' }}>
                {imageUrl ? (<img src={imageUrl} alt={currentDetailPkg.name} style={{ width: '100%', maxHeight: 220, objectFit: 'contain' }} />) : (<PictureOutlined style={{ fontSize: 80, color: '#a0aec0' }} />)}
                <div style={{ marginTop: 25, textAlign: 'center' }}>
                  <Tag color="blue" style={{ marginBottom: 10, fontSize: 13, padding: '4px 12px', borderRadius: 20 }}>{currentDetailPkg.category}</Tag>
                  <Title level={4} style={{ color: '#004b87', margin: 0 }}>{currentDetailPkg.code}</Title>
                </div>
              </Col>
              <Col xs={24} md={14} style={{ padding: '30px 40px', display: 'flex', flexDirection: 'column' }}>
                <Title level={3} style={{ color: '#2d3748', marginTop: 0 }}>{currentDetailPkg.name}</Title>
                <div style={{ color: '#d81b60', fontSize: '24px', fontWeight: 'bold', marginBottom: 20 }}>
                  {currentDetailPkg.price ? currentDetailPkg.price.toLocaleString('vi-VN') : '0'} đ <span style={{ fontSize: 16, color: '#718096', fontWeight: 'normal' }}>/tháng</span>
                </div>
                <div style={{ background: '#f0f5ff', padding: '15px 20px', borderRadius: 8, marginBottom: 25, flexGrow: 1 }}>
                  <Text strong style={{ color: '#004b87', fontSize: 15, display: 'block', marginBottom: 10 }}><InfoCircleOutlined /> MÔ TẢ CHI TIẾT</Text>
                  {currentDetailPkg.description ? (
                    currentDetailPkg.description.split('\n').map((line, idx) => (
                      <Paragraph key={idx} style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'flex-start' }}><CheckCircleFilled style={{ color: '#52c41a', marginTop: 4, marginRight: 8 }} /><span>{line}</span></Paragraph>
                    ))
                  ) : (<Paragraph style={{ color: '#718096' }}>Hệ thống đang cập nhật mô tả chi tiết cho gói cước này.</Paragraph>)}
                </div>
                <Button type="primary" size="large" onClick={handleProceedToOrder} style={{ background: '#004b87', height: 48, borderRadius: 8, fontWeight: 'bold', fontSize: 16, boxShadow: '0 4px 15px rgba(0,75,135,0.2)' }}>TIẾN HÀNH ĐĂNG KÝ</Button>
              </Col>
            </Row>
          );
        })()}
      </Modal>

      {/* CÁC MODAL HỖ TRỢ & ĐĂNG KÝ */}
      <Modal title={<span style={{ color: '#004b87', fontSize: 18, fontWeight: 'bold' }}><UserOutlined /> Hồ sơ tài khoản khách hàng</span>} open={isProfileModalVisible} onCancel={() => setIsProfileModalVisible(false)} footer={[<Button key="close" type="primary" onClick={() => setIsProfileModalVisible(false)} style={{ background: '#004b87', borderRadius: 6 }}>Đóng</Button>]} width={850} centered>
        <div style={{ padding: '15px 0' }}>
          <Row gutter={[30, 30]} align="middle">
            <Col xs={24} md={7} style={{ textAlign: 'center', borderRight: '1px solid #edf2f7' }}>
              <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#f0f7ff', color: '#004b87', border: '3px solid #004b87', marginBottom: 15, boxShadow: '0 4px 12px rgba(0,75,135,0.1)' }} />
              <Title level={4} style={{ margin: '0 0 4px 0', color: '#2d3748' }}>{userProfile.fullName}</Title>
              <Tag color="blue" style={{ borderRadius: 4, padding: '2px 10px' }}>Thành viên VNPT</Tag>
            </Col>
            <Col xs={24} md={17}>
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ color: '#004b87', borderBottom: '2px solid #edf2f7', paddingBottom: 6, marginBottom: 12, fontSize: 15, fontWeight: 'bold' }}>Thông tin chung</h4>
                <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small" colon={false} labelStyle={{ fontWeight: 'bold', width: '120px', color: '#718096' }}>
                  <Descriptions.Item label="Họ tên:"><span style={{ color: '#2d3748', fontWeight: 600 }}>{userProfile.fullName}</span></Descriptions.Item>
                  <Descriptions.Item label="Điện thoại:"><span style={{ color: '#2d3748', fontWeight: 600 }}>{userProfile.phone}</span></Descriptions.Item>
                  <Descriptions.Item label="Giới tính:">{userProfile.gender}</Descriptions.Item>
                  <Descriptions.Item label="Loại KH:"><Tag color="purple">{userProfile.customerType || 'Cá nhân'}</Tag></Descriptions.Item>
                  <Descriptions.Item label="CC/CCCD:">{userProfile.cccd}</Descriptions.Item>
                  <Descriptions.Item label="Tình trạng:"><Tag color="green">{userProfile.status || 'Đang hoạt động'}</Tag></Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <h4 style={{ color: '#004b87', borderBottom: '2px solid #edf2f7', paddingBottom: 6, marginBottom: 12, fontSize: 15, fontWeight: 'bold' }}>Thông tin liên lạc</h4>
                <Descriptions column={1} size="small" colon={false} labelStyle={{ fontWeight: 'bold', width: '120px', color: '#718096' }}>
                  <Descriptions.Item label="Email:">{userProfile.email}</Descriptions.Item>
                  <Descriptions.Item label="Tỉnh / Thành:">{userProfile.province}</Descriptions.Item>
                  <Descriptions.Item label="Quận / Huyện:">{userProfile.district}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ:">{userProfile.address}</Descriptions.Item>
                </Descriptions>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal title={<Title level={4} style={{ color: '#004b87', margin: 0 }}><HistoryOutlined /> Lịch sử đăng ký dịch vụ</Title>} open={isHistoryModalVisible} onCancel={() => setIsHistoryModalVisible(false)} footer={null} width={850}>
        <div style={{ marginTop: 15 }}><Table columns={historyColumns} dataSource={myOrders} rowKey="id" loading={historyLoading} pagination={{ pageSize: 5 }} /></div>
      </Modal>

      <Modal title={<Title level={4} style={{ color: '#004b87', margin: 0 }}><CustomerServiceOutlined /> Yêu cầu hỗ trợ & Phản hồi từ VNPT</Title>} open={isMyTicketsModalVisible} onCancel={() => setIsMyTicketsModalVisible(false)} footer={[<Button key="close" type="primary" onClick={() => setIsMyTicketsModalVisible(false)} style={{ background: '#004b87', borderRadius: 6 }}>Đóng</Button>]} width={950} centered>
        <div style={{ marginTop: 15 }}><Table columns={myTicketColumns} dataSource={myTickets} rowKey="id" loading={ticketsLoading} pagination={{ pageSize: 5 }} /></div>
      </Modal>

      <Modal title={<Title level={4} style={{ margin: 0, color: '#004b87' }}>{supportModalType === 'CONTACT' ? 'Thông tin liên hệ' : supportModalType === 'STORE' ? 'Hệ thống điểm giao dịch VNPT' : 'Quy định giữ số'}</Title>} open={isSupportModalVisible} onCancel={() => setIsSupportModalVisible(false)} footer={[<Button key="close" type="primary" onClick={() => setIsSupportModalVisible(false)} style={{ background: '#004b87', borderRadius: 6 }}>Đóng</Button>]} width={950} centered>
        <Divider style={{ margin: '10px 0 20px 0' }} />{renderSupportModalContent()}
      </Modal>

      <Modal title={<Title level={4} style={{ color: '#004b87', margin: 0 }}>Gửi yêu cầu hỗ trợ / Báo hỏng mạng</Title>} open={isTicketModalVisible} onCancel={() => setIsTicketModalVisible(false)} footer={null} centered width={600}>
        <Form layout="vertical" form={ticketForm} onFinish={handleSubmisionTicket} style={{ marginTop: 20 }}>
          <Form.Item name="customerName" label="Họ và tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}><Input size="large" style={{ borderRadius: 6 }} /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="phone" label="Số điện thoại liên hệ" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}><Input size="large" style={{ borderRadius: 6 }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="title" label="Tiêu đề sự cố" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}><Input size="large" placeholder="VD: Mất kết nối Internet" style={{ borderRadius: 6 }} /></Form.Item></Col>
          </Row>
          <Form.Item name="content" label="Nội dung chi tiết sự cố" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}><TextArea rows={3} placeholder="Mô tả tình trạng chi tiết..." style={{ borderRadius: 6 }} /></Form.Item>
          <Form.Item label="Hình ảnh chụp sự cố (nếu có)" name="issueImage" valuePropName="fileList" getValueFromEvent={normFile}><Upload beforeUpload={() => false} maxCount={1} listType="picture" accept="image/*"><Button icon={<UploadOutlined />}>Tải ảnh lên</Button></Upload></Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 20 }}>
            <Button onClick={() => setIsTicketModalVisible(false)} style={{ marginRight: 10, borderRadius: 6 }}>Hủy</Button><Button type="primary" htmlType="submit" size="large" loading={ticketLoading} style={{ background: '#004b87', borderRadius: 6, fontWeight: 'bold' }}>Gửi yêu cầu</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={<Title level={4} style={{ color: '#004b87', margin: 0 }}>{editingOrderId ? `Cập nhật hồ sơ: ${selectedPackage?.code}` : `Đăng ký dịch vụ: ${selectedPackage?.code}`}</Title>} open={isOrderModalVisible} onCancel={() => setIsOrderModalVisible(false)} footer={null} centered width={650}>
        <Form layout="vertical" form={orderForm} onFinish={handleSubmitOrder} style={{ marginTop: 20 }}>
          <Form.Item name="customerName" label="Họ và tên khách hàng" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}><Input size="large" style={{ borderRadius: 6 }} /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}><Input size="large" style={{ borderRadius: 6 }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="address" label="Địa chỉ lắp đặt / Giao sim" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}><Input size="large" style={{ borderRadius: 6 }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item label="CCCD Mặt trước" name="cccdFront" valuePropName="fileList" getValueFromEvent={normFile}><Upload beforeUpload={() => false} maxCount={1} listType="picture" accept="image/*"><Button icon={<UploadOutlined />}>Tải ảnh lên</Button></Upload></Form.Item></Col>
            <Col span={12}><Form.Item label="CCCD Mặt sau" name="cccdBack" valuePropName="fileList" getValueFromEvent={normFile}><Upload beforeUpload={() => false} maxCount={1} listType="picture" accept="image/*"><Button icon={<UploadOutlined />}>Tải ảnh lên</Button></Upload></Form.Item></Col>
          </Row>
          <Form.Item name="note" label="Ghi chú thêm"><TextArea rows={2} style={{ borderRadius: 6 }} /></Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button onClick={() => setIsOrderModalVisible(false)} style={{ marginRight: 10 }}>Hủy</Button><Button type="primary" htmlType="submit" size="large" loading={orderLoading}>{editingOrderId ? 'Gửi lại hồ sơ' : 'Xác nhận đăng ký'}</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* UI GIAO DIỆN CHATBOT AI THẬT */}
      {/* ------------------------------------------------------------- */}
      
      {!isChatOpen && (
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined style={{ fontSize: 28 }} />}
          style={{ position: 'fixed', bottom: 40, right: 40, width: 65, height: 65, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,75,135,0.4)', background: '#004b87', border: 'none' }}
          onClick={() => setIsChatOpen(true)}
        />
      )}

      {isChatOpen && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
              <RobotOutlined style={{ fontSize: 26, marginRight: 10 }} />
              <div>
                <span style={{ fontWeight: 'bold', fontSize: 16, display: 'block' }}>VNPT AI Assistant</span>
                <span style={{ fontSize: 12, fontWeight: 'normal', opacity: 0.8 }}>Hỗ trợ trực tuyến thông minh</span>
              </div>
            </div>
          }
          extra={<Button type="text" icon={<CloseOutlined style={{ color: '#fff', fontSize: 18 }}/>} onClick={() => setIsChatOpen(false)} />}
          style={{ position: 'fixed', bottom: 20, right: 30, width: 360, zIndex: 9999, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', borderRadius: 16, overflow: 'hidden' }}
          styles={{ header: { background: 'linear-gradient(135deg, #003366 0%, #0072bc 100%)', borderBottom: 'none', padding: '12px 20px' }, body: { padding: 0 } }}
        >
          <div ref={chatScrollRef} style={{ height: 380, overflowY: 'auto', padding: '20px 15px', background: '#f8fbff', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  background: msg.sender === 'user' ? '#0072bc' : '#ffffff', 
                  color: msg.sender === 'user' ? '#ffffff' : '#2d3748', 
                  padding: '10px 16px', 
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
                  fontSize: 14,
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '12px 15px', borderTop: '1px solid #edf2f7', background: '#ffffff', display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="Nhập câu hỏi cho AI..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onPressEnter={handleSendChat}
              style={{ borderRadius: 20, padding: '8px 15px', border: '1px solid #d9d9d9' }}
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<SendOutlined />} 
              onClick={handleSendChat} 
              style={{ marginLeft: 10, background: '#004b87', width: 40, height: 40 }} 
            />
          </div>
        </Card>
      )}

    </Layout>
  );
};

export default CustomerPortal;