import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, Select, Input, Typography, Divider, Row, Col, message, Spin, InputNumber, Table, Modal } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, LaptopOutlined, UserOutlined, ToolOutlined, PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
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
    const [note, setNote] = useState('') // Used as ghiChuKyThuat
    const [chanDoan, setChanDoan] = useState('')
    const [congTho, setCongTho] = useState(0)
    
    const [techs, setTechs] = useState([])
    const [selectedTech, setSelectedTech] = useState(null)
    
    // Inventory and Parts State
    const [inventory, setInventory] = useState([])
    const [selectedParts, setSelectedParts] = useState([])
    const [isPartsModalVisible, setIsPartsModalVisible] = useState(false)
    const [searchPart, setSearchPart] = useState('')

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
                
                // Populate existing repair details
                if (data.data.chiTietSuaChua) {
                    setChanDoan(data.data.chiTietSuaChua.chanDoan || '')
                    setNote(data.data.chiTietSuaChua.ghiChuKyThuat || '')
                    setCongTho(data.data.chiTietSuaChua.congTho || 0)
                    if (data.data.chiTietSuaChua.danhSachLinhKien) {
                        setSelectedParts(data.data.chiTietSuaChua.danhSachLinhKien.map(p => ({
                            _id: p.linhKien?._id || p.linhKien,
                            tenLinhKien: p.tenLinhKien,
                            soLuong: p.soLuong,
                            giaBan: p.donGia,
                            maSKU: p.linhKien?.maSKU || ''
                        })))
                    }
                }
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

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/inventory', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setInventory(data.data)
            }
        } catch (error) {
            console.error('Error fetching inventory:', error)
        }
    }

    useEffect(() => {
        fetchOrder()
        fetchTechs()
        if (user?.role === 'technician') {
            fetchInventory()
        }
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
                body: JSON.stringify({ trangThai: status })
            })
            const data = await response.json()
            if (data.success) {
                message.success('Đã cập nhật trạng thái')
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
                message.success('Đã nhận việc thành công')
                fetchOrder()
            } else {
                message.error(data.message)
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi phân công')
        }
    }

    const handleSaveRepairDetails = async () => {
        try {
            const token = localStorage.getItem('token')
            const payload = {
                linhKienList: selectedParts.map(p => ({ linhKienId: p._id, soLuong: p.soLuong })),
                congTho: congTho,
                chanDoan: chanDoan,
                ghiChuKyThuat: note
            }
            
            const response = await fetch(`http://localhost:5000/api/orders/${id}/parts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            const data = await response.json()
            if (data.success) {
                message.success('Đã lưu thông tin chẩn đoán và linh kiện')
                fetchOrder()
                
                // Optionally auto-update status if it's ChoBaoGia
                if (order.trangThai === 'ChoBaoGia') {
                    setStatus('ChoKhachDuyet')
                }
            } else {
                message.error(data.message)
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi khi lưu thông tin chẩn đoán')
        }
    }

    const addPartToOrder = (part) => {
        const existing = selectedParts.find(p => p._id === part._id)
        if (existing) {
            setSelectedParts(selectedParts.map(p => p._id === part._id ? { ...p, soLuong: p.soLuong + 1 } : p))
        } else {
            setSelectedParts([...selectedParts, { ...part, soLuong: 1 }])
        }
        message.success(`Đã thêm ${part.tenLinhKien}`)
    }

    const removePart = (partId) => {
        setSelectedParts(selectedParts.filter(p => p._id !== partId))
    }

    const updatePartQuantity = (partId, soLuong) => {
        if (soLuong <= 0) removePart(partId)
        else setSelectedParts(selectedParts.map(p => p._id === partId ? { ...p, soLuong } : p))
    }

    const filteredInventory = inventory.filter(p => 
        p.tenLinhKien.toLowerCase().includes(searchPart.toLowerCase()) || 
        p.maSKU?.toLowerCase().includes(searchPart.toLowerCase())
    )

    if (loading) return <div className="p-12 text-center"><Spin size="large" /></div>
    if (!order) return <div className="p-12 text-center">Không tìm thấy đơn hàng</div>

    const inventoryColumns = [
        { title: 'SKU', dataIndex: 'maSKU', key: 'sku' },
        { title: 'Tên linh kiện', dataIndex: 'tenLinhKien', key: 'name' },
        { title: 'Tồn kho', dataIndex: 'soLuongTon', key: 'stock', render: stock => <Tag color={stock > 0 ? 'green' : 'red'}>{stock}</Tag> },
        { title: 'Giá bán', dataIndex: 'giaBan', key: 'price', render: price => `${price.toLocaleString()}đ` },
        { title: '', key: 'action', render: (_, r) => <Button size="small" type="primary" disabled={r.soLuongTon === 0} onClick={() => addPartToOrder(r)} icon={<PlusOutlined />}>Thêm</Button> }
    ]

    const totalPartsCost = selectedParts.reduce((sum, p) => sum + (p.giaBan * p.soLuong), 0)
    const totalEstimatedCost = totalPartsCost + congTho

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
                <Title level={4} className="!mb-0 text-base md:text-xl truncate">Chi tiết: {order.maVanDon}</Title>
                <Tag color={statusColors[order.trangThai]} className="ml-auto">{statusLabels[order.trangThai]}</Tag>
            </div>

            {/* Self-assign Notification for Techs */}
            {user?.role === 'technician' && !order.kyThuatVien && order.trangThai === 'ChoBaoGia' && (
                <Card className="shadow-sm border-0 bg-blue-50 border-blue-200 border" style={{ borderRadius: 12 }}>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <Title level={5} className="!mb-1 text-blue-800">Đơn hàng đang chờ xử lý</Title>
                            <Text className="text-blue-600">Đơn hàng này chưa có thợ phụ trách. Nhận việc ngay để bắt đầu kiểm tra.</Text>
                        </div>
                        <Button type="primary" size="large" onClick={() => handleAssign(user._id)}>Nhận Đơn Này</Button>
                    </div>
                </Card>
            )}

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
                            <Text strong>Mô tả lỗi từ khách hàng:</Text>
                            <Paragraph className="mt-2 p-3 bg-gray-50 rounded-lg whitespace-pre-line">{order.tinhTrangLoi}</Paragraph>
                        </div>
                        {order.ghiChu && (
                            <div className="mt-4">
                                <Text strong>Ghi chú khách/tiếp tân:</Text>
                                <Paragraph className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-lg italic whitespace-pre-line">{order.ghiChu}</Paragraph>
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

                    {/* Technician Diagnosis and Repair Details */}
                    {((user.role === 'technician' && order.kyThuatVien?._id === user._id) || user.role === 'admin') && (
                        <Card title={<span><ToolOutlined className="mr-2" />Chẩn đoán & Báo giá sửa chữa</span>} className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                            <div className="space-y-4">
                                <div>
                                    <Text className="block mb-1 text-gray-500">Chẩn đoán nguyên nhân lỗi:</Text>
                                    <TextArea 
                                        value={chanDoan} 
                                        onChange={e => setChanDoan(e.target.value)} 
                                        rows={3} 
                                        placeholder="Ghi rõ nguyên nhân hỏng hóc sau khi kiểm tra máy..." 
                                    />
                                </div>
                                
                                <Card type="inner" title="Danh sách linh kiện đề xuất" extra={<Button size="small" onClick={() => setIsPartsModalVisible(true)} icon={<PlusOutlined />}>Tìm & Thêm Linh Kiện</Button>}>
                                    {selectedParts.length === 0 ? (
                                        <div className="text-center text-gray-400 py-4">Chưa có linh kiện nào được chọn</div>
                                    ) : (
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={selectedParts}
                                            renderItem={item => (
                                                <List.Item
                                                    actions={[
                                                        <InputNumber min={1} value={item.soLuong} onChange={(v) => updatePartQuantity(item._id, v)} size="small" />,
                                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removePart(item._id)} />
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        title={item.tenLinhKien}
                                                        description={`${item.maSKU || ''} - ${item.giaBan.toLocaleString()}đ x ${item.soLuong}`}
                                                    />
                                                    <div className="font-medium text-primary-600">
                                                        {(item.giaBan * item.soLuong).toLocaleString()}đ
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    )}
                                    <div className="mt-4 flex justify-between items-center border-t pt-4">
                                        <Text>Công thợ / Dịch vụ:</Text>
                                        <InputNumber 
                                            min={0} 
                                            step={50000} 
                                            value={congTho} 
                                            onChange={setCongTho} 
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            style={{ width: 150 }}
                                            addonAfter="đ"
                                        />
                                    </div>
                                    <div className="mt-3 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <Text strong>Tổng chi phí dự kiến:</Text>
                                        <Text strong className="text-lg text-primary-600">{totalEstimatedCost.toLocaleString()}đ</Text>
                                    </div>
                                </Card>

                                <div>
                                    <Text className="block mb-1 text-gray-500">Ghi chú nội bộ (Chỉ kỹ thuật/admin xem):</Text>
                                    <TextArea 
                                        value={note} 
                                        onChange={e => setNote(e.target.value)} 
                                        rows={2} 
                                        placeholder="Ghi chú thêm..." 
                                    />
                                </div>

                                <div className="text-right">
                                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveRepairDetails} size="large">
                                        Lưu Thông Tin Sửa Chữa
                                    </Button>
                                    <Text className="block text-xs text-gray-400 mt-2">Lưu ý: Thêm linh kiện sẽ tự động trừ tồn kho. Kỹ thuật viên tự chịu trách nhiệm kê khai.</Text>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card title="Cập nhật trạng thái hiển thị" className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Select value={status} onChange={setStatus} className="w-full md:w-64">
                                {Object.keys(statusLabels).map(key => (
                                    <Option key={key} value={key}>{statusLabels[key]}</Option>
                                ))}
                            </Select>
                            <Button type="default" onClick={handleUpdateStatus}>Chuyển trạng thái</Button>
                        </div>
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

                    <Card title="Phụ trách" className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                        <div className="space-y-4">
                            <div>
                                <Text className="text-gray-500 text-xs block">Kỹ thuật hiện tại:</Text>
                                <div className="mt-1 font-medium">{order.kyThuatVien?.hoTen || <Text type="danger italic">Chưa phân công</Text>}</div>
                                {order.kyThuatVien?.soDienThoai && <div className="text-sm text-gray-500">{order.kyThuatVien.soDienThoai}</div>}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal 
                title="Chọn linh kiện thêm vào đơn" 
                open={isPartsModalVisible} 
                onCancel={() => setIsPartsModalVisible(false)}
                width={800}
                footer={null}
            >
                <Input 
                    placeholder="Tìm theo tên hoặc SKU..." 
                    prefix={<SearchOutlined />} 
                    value={searchPart} 
                    onChange={e => setSearchPart(e.target.value)} 
                    className="mb-4" 
                />
                <Table 
                    columns={inventoryColumns} 
                    dataSource={filteredInventory} 
                    rowKey="_id" 
                    pagination={{ pageSize: 5 }} 
                    size="small" 
                />
            </Modal>
        </div>
    )
}

export default OrderDetail
