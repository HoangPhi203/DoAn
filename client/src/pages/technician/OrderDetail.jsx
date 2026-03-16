import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, Select, Input, Timeline, Typography, Divider, Row, Col, message, Spin } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, LaptopOutlined, UserOutlined, ToolOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const statusLabels = {
    'ChoBaoGia': 'Chờ kiểm tra',
    'ChoKhachDuyet': 'Chờ KQ Duyệt',
    'DangSua': 'Đang sửa',
    'ChoLinhKien': 'Chờ linh kiện',
    'HoanThanh': 'Hoàn thành',
    'DaTraKhach': 'Đã trả khách'
}

const statusColors = {
    'ChoBaoGia': 'purple',
    'ChoKhachDuyet': 'orange',
    'DangSua': 'blue',
    'ChoLinhKien': 'volcano',
    'HoanThanh': 'green',
    'DaTraKhach': 'default'
}

const OrderDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [note, setNote] = useState('')
    const [techs, setTechs] = useState([])
    const [selectedTech, setSelectedTech] = useState(null)

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setOrder(data.data)
                setStatus(data.data.trangThai)
                setSelectedTech(data.data.kyThuatVien?._id)
            } else {
                message.error(data.message)
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi tải thông tin đơn hàng')
        } finally {
            setLoading(false)
        }
    }

    const fetchTechs = async () => {
        if (user?.role === 'technician') return
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/auth/technicians', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setTechs(data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrder()
        fetchTechs()
    }, [id])

    const handleUpdateStatus = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ trangThai: status, ghiChu: note })
            })
            const data = await response.json()
            if (data.success) {
                message.success('Đã cập nhật trạng thái')
                setNote('')
                fetchOrder()
            } else {
                message.error(data.message)
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi cập nhật trạng thái')
        }
    }

    const handleAssign = async (techId) => {
        try {
            setSelectedTech(techId)
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/orders/${id}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ kyThuatVienId: techId })
            })
            const data = await response.json()
            if (data.success) {
                message.success('Đã phân công kỹ thuật viên')
                fetchOrder()
            } else {
                message.error(data.message)
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi phân công')
        }
    }

    if (loading) return <div className="p-12 text-center"><Spin size="large" /></div>
    if (!order) return <div className="p-12 text-center">Không tìm thấy đơn hàng</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
                <Title level={4} className="!mb-0 text-base md:text-xl truncate">Chi tiết: {order.maVanDon}</Title>
                <Tag color={statusColors[order.trangThai]} className="ml-auto">{statusLabels[order.trangThai]}</Tag>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title={<span><LaptopOutlined className="mr-2" />Thông tin thiết bị</span>} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Descriptions column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Model">{order.modelMay}</Descriptions.Item>
                            <Descriptions.Item label="Serial/IMEI">{order.serialIMEI || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày nhận">{new Date(order.ngayNhan).toLocaleDateString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Phụ kiện">{order.phuKienKem?.join(', ') || 'Không có'}</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <div>
                            <Text strong>Mô tả lỗi:</Text>
                            <Paragraph className="mt-2 p-3 bg-gray-50 rounded-lg">{order.tinhTrangLoi}</Paragraph>
                        </div>
                        {order.ghiChu && (
                            <div className="mt-4">
                                <Text strong>Ghi chú khách/tiếp tân:</Text>
                                <Paragraph className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-lg italic">{order.ghiChu}</Paragraph>
                            </div>
                        )}
                    </Card>

                    {(user.role === 'admin' || user.role === 'receptionist') && (
                        <Card title={<span><ToolOutlined className="mr-2" />Phân công & Quản lý</span>} className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Text className="block mb-2 text-gray-500">Kỹ thuật viên phụ trách:</Text>
                                    <Select 
                                        placeholder="Chọn kỹ thuật viên" 
                                        className="w-full" 
                                        value={selectedTech}
                                        onChange={handleAssign}
                                    >
                                        <Option value={null}>Chưa phân công</Option>
                                        {techs.map(t => <Option key={t._id} value={t._id}>{t.hoTen} ({t.soDienThoai})</Option>)}
                                    </Select>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card title="Cập nhật tiến độ" className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <Select value={status} onChange={setStatus} className="w-full md:w-64">
                                {Object.keys(statusLabels).map(key => (
                                    <Option key={key} value={key}>{statusLabels[key]}</Option>
                                ))}
                            </Select>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleUpdateStatus}>Cập nhật trạng thái</Button>
                        </div>
                        <TextArea 
                            value={note} 
                            onChange={e => setNote(e.target.value)} 
                            rows={3} 
                            placeholder="Thêm ghi chú kỹ thuật, báo giá nháp hoặc nội dung phản hồi khách hàng..." 
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={<span><UserOutlined className="mr-2" />Khách hàng</span>} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <div className="space-y-3">
                            <div><Text className="text-gray-500 block text-xs">Họ tên:</Text> <Text strong>{order.khachHang?.hoTen}</Text></div>
                            <div><Text className="text-gray-500 block text-xs">Số điện thoại:</Text> <Text>{order.khachHang?.soDienThoai}</Text></div>
                            <div><Text className="text-gray-500 block text-xs">Địa chỉ:</Text> <Text className="text-sm">{order.khachHang?.diaChi || 'Chưa cập nhật'}</Text></div>
                        </div>
                    </Card>

                    <Card title="Lịch sử xử lý" className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                        <div className="space-y-4">
                            <div>
                                <Text className="text-gray-500 text-xs">Kỹ thuật hiện tại:</Text>
                                <div className="mt-1 font-medium">{order.kyThuatVien?.hoTen || <Text type="danger italic">Chưa phân công</Text>}</div>
                            </div>
                            <Divider className="!my-2" />
                            <Paragraph className="text-gray-400 text-center italic text-sm py-4">
                                Dữ liệu lịch sử chi tiết đang được đồng bộ...
                            </Paragraph>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderDetail
