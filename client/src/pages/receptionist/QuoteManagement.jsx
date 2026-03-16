import { useState, useEffect, useCallback } from 'react'
import { Card, Table, Tag, Button, Modal, Form, InputNumber, Input, Typography, Space, message, Select, Popconfirm, Spin, Empty } from 'antd'
import { FileTextOutlined, SendOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const API_BASE = 'http://localhost:5000/api'

const QuoteManagement = () => {
    const [quotes, setQuotes] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [quoteModal, setQuoteModal] = useState(false)
    const [detailModal, setDetailModal] = useState(false)
    const [rejectModal, setRejectModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [selectedQuote, setSelectedQuote] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [form] = Form.useForm()
    const [rejectForm] = Form.useForm()
    const { user } = useAuth()

    const getToken = () => localStorage.getItem('token')

    const fetchHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }), [])

    // Lấy danh sách báo giá
    const fetchQuotes = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/quotes`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success) {
                setQuotes(data.data)
            }
        } catch {
            message.error('Không thể tải danh sách báo giá')
        } finally {
            setLoading(false)
        }
    }, [fetchHeaders])

    // Lấy danh sách đơn hàng chờ báo giá
    const fetchPendingOrders = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/orders?trangThai=ChoBaoGia`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success) {
                setOrders(data.data)
            }
        } catch {
            // Silent fail
        }
    }, [fetchHeaders])

    useEffect(() => {
        fetchQuotes()
        fetchPendingOrders()
    }, [fetchQuotes, fetchPendingOrders])

    // Tạo báo giá mới
    const handleCreateQuote = (order) => {
        setSelectedOrder(order)
        form.resetFields()
        setQuoteModal(true)
    }

    const handleSubmitQuote = async (values) => {
        try {
            const body = {
                donHangId: selectedOrder._id,
                danhSachLinhKien: values.danhSachLinhKien || [],
                chiPhiDichVu: values.chiPhiDichVu || [],
                thoiGianDuKien: values.thoiGianDuKien,
                ghiChu: values.ghiChu
            }

            const res = await fetch(`${API_BASE}/quotes`, {
                method: 'POST',
                headers: fetchHeaders(),
                body: JSON.stringify(body)
            })

            const data = await res.json()
            if (data.success) {
                message.success(data.message || 'Đã tạo báo giá thành công!')
                setQuoteModal(false)
                form.resetFields()
                fetchQuotes()
                fetchPendingOrders()
            } else {
                message.error(data.message)
            }
        } catch {
            message.error('Lỗi khi tạo báo giá')
        }
    }

    // Phê duyệt báo giá
    const handleApprove = async (quoteId) => {
        try {
            const res = await fetch(`${API_BASE}/quotes/${quoteId}/approve`, {
                method: 'PUT',
                headers: fetchHeaders()
            })
            const data = await res.json()
            if (data.success) {
                message.success('Đã phê duyệt báo giá')
                fetchQuotes()
            } else {
                message.error(data.message)
            }
        } catch {
            message.error('Lỗi khi phê duyệt')
        }
    }

    // Từ chối báo giá
    const handleReject = (quote) => {
        setSelectedQuote(quote)
        rejectForm.resetFields()
        setRejectModal(true)
    }

    const handleSubmitReject = async (values) => {
        try {
            const res = await fetch(`${API_BASE}/quotes/${selectedQuote._id}/reject`, {
                method: 'PUT',
                headers: fetchHeaders(),
                body: JSON.stringify({ lyDoTuChoi: values.lyDoTuChoi })
            })
            const data = await res.json()
            if (data.success) {
                message.success('Đã từ chối báo giá')
                setRejectModal(false)
                fetchQuotes()
                fetchPendingOrders()
            } else {
                message.error(data.message)
            }
        } catch {
            message.error('Lỗi khi từ chối báo giá')
        }
    }

    // Xem chi tiết
    const handleViewDetail = async (quoteId) => {
        try {
            const res = await fetch(`${API_BASE}/quotes/${quoteId}`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success) {
                setSelectedQuote(data.data)
                setDetailModal(true)
            }
        } catch {
            message.error('Không thể tải chi tiết báo giá')
        }
    }

    const trangThaiColors = {
        'ChoPheDuyet': 'orange',
        'DaPheDuyet': 'green',
        'TuChoi': 'red'
    }

    const trangThaiLabels = {
        'ChoPheDuyet': 'Chờ phê duyệt',
        'DaPheDuyet': 'Đã phê duyệt',
        'TuChoi': 'Từ chối'
    }

    const formatCurrency = (value) => {
        return value ? value.toLocaleString('vi-VN') + 'đ' : '0đ'
    }

    const filteredQuotes = quotes.filter(q => 
        q.maBaoGia?.toLowerCase().includes(searchText.toLowerCase()) || 
        q.donHang?.maVanDon?.toLowerCase().includes(searchText.toLowerCase()) ||
        q.donHang?.khachHang?.hoTen?.toLowerCase().includes(searchText.toLowerCase()) ||
        q.donHang?.khachHang?.soDienThoai?.includes(searchText)
    )

    const columns = [
        {
            title: 'Mã báo giá',
            dataIndex: 'maBaoGia',
            key: 'maBaoGia',
            render: text => <span className="font-mono font-medium">{text}</span>
        },
        {
            title: 'Mã đơn hàng',
            key: 'donHang',
            render: (_, record) => <span className="font-mono">{record.donHang?.maVanDon || 'N/A'}</span>
        },
        {
            title: 'Thiết bị',
            key: 'device',
            render: (_, record) => record.donHang?.modelMay || 'N/A'
        },
        {
            title: 'Tổng cộng',
            dataIndex: 'tongCong',
            key: 'tongCong',
            render: value => <span className="font-semibold text-blue-600">{formatCurrency(value)}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: status => <Tag color={trangThaiColors[status]}>{trangThaiLabels[status]}</Tag>
        },
        {
            title: 'KTV',
            key: 'kyThuatVien',
            render: (_, record) => record.kyThuatVien?.hoTen || 'N/A'
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record._id)}>Xem</Button>
                    {record.trangThai === 'ChoPheDuyet' && (
                        <>
                            <Popconfirm title="Phê duyệt báo giá này?" onConfirm={() => handleApprove(record._id)}>
                                <Button type="primary" size="small" icon={<CheckCircleOutlined />}>Duyệt</Button>
                            </Popconfirm>
                            <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleReject(record)}>Từ chối</Button>
                        </>
                    )}
                </Space>
            )
        },
    ]

    const pendingOrderColumns = [
        {
            title: 'Mã đơn',
            dataIndex: 'maVanDon',
            key: 'maVanDon',
            render: text => <span className="font-mono font-medium">{text}</span>
        },
        {
            title: 'Khách hàng',
            key: 'khachHang',
            render: (_, record) => record.khachHang?.hoTen || 'N/A'
        },
        {
            title: 'Thiết bị',
            dataIndex: 'modelMay',
            key: 'modelMay'
        },
        {
            title: 'Tình trạng lỗi',
            dataIndex: 'tinhTrangLoi',
            key: 'tinhTrangLoi',
            ellipsis: true
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => handleCreateQuote(record)}>
                    Tạo báo giá
                </Button>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Title level={4} className="!mb-0">Quản lý báo giá</Title>
                <div className="flex gap-3 w-full md:w-auto">
                    <Input 
                        placeholder="Tìm mã, tên, SĐT..." 
                        prefix={<SearchOutlined />} 
                        value={searchText} 
                        onChange={e => setSearchText(e.target.value)} 
                        className="w-full md:w-64"
                        allowClear
                    />
                    <Button icon={<ReloadOutlined />} onClick={() => { fetchQuotes(); fetchPendingOrders() }}>Làm mới</Button>
                </div>
            </div>

            {/* Đơn hàng chờ báo giá */}
            {orders.length > 0 && (
                <Card title={`Đơn hàng chờ báo giá (${orders.length})`} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                    <Table columns={pendingOrderColumns} dataSource={orders} rowKey="_id" pagination={false} size="small" />
                </Card>
            )}

            {/* Danh sách báo giá */}
            <Card title="Danh sách báo giá" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                {loading ? (
                    <div className="text-center py-8"><Spin size="large" /></div>
                ) : quotes.length === 0 ? (
                    <Empty description="Chưa có báo giá nào" />
                ) : (
                    <Table columns={columns} dataSource={filteredQuotes} rowKey="_id" pagination={{ pageSize: 10 }} />
                )}
            </Card>

            {/* Modal tạo báo giá */}
            <Modal
                title={`Tạo báo giá - ${selectedOrder?.maVanDon}`}
                open={quoteModal}
                onCancel={() => setQuoteModal(false)}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmitQuote} className="mt-4">
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div><Text className="text-gray-500">Thiết bị:</Text><div className="font-medium">{selectedOrder?.modelMay}</div></div>
                        <div><Text className="text-gray-500">Lỗi:</Text><div className="font-medium">{selectedOrder?.tinhTrangLoi?.slice(0, 80)}</div></div>
                    </div>

                    {/* Linh kiện */}
                    <Title level={5}>Linh kiện</Title>
                    <Form.List name="danhSachLinhKien">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex gap-2 mb-2">
                                        <Form.Item {...restField} name={[name, 'tenLinhKien']} rules={[{ required: true, message: 'Nhập tên' }]} className="flex-1 !mb-0">
                                            <Input placeholder="Tên linh kiện" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'soLuong']} rules={[{ required: true, message: 'SL' }]} className="!mb-0" style={{ width: 80 }}>
                                            <InputNumber min={1} placeholder="SL" className="w-full" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'donGia']} rules={[{ required: true, message: 'Giá' }]} className="!mb-0" style={{ width: 150 }}>
                                            <InputNumber min={0} placeholder="Đơn giá" className="w-full" formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={val => val.replace(/,/g, '')} />
                                        </Form.Item>
                                        <Button icon={<DeleteOutlined />} danger onClick={() => remove(name)} />
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mb-4">Thêm linh kiện</Button>
                            </>
                        )}
                    </Form.List>

                    {/* Dịch vụ */}
                    <Title level={5}>Chi phí dịch vụ</Title>
                    <Form.List name="chiPhiDichVu">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex gap-2 mb-2">
                                        <Form.Item {...restField} name={[name, 'tenDichVu']} rules={[{ required: true, message: 'Nhập tên dịch vụ' }]} className="flex-1 !mb-0">
                                            <Input placeholder="Tên dịch vụ (VD: Công thợ, Vệ sinh...)" />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'chiPhi']} rules={[{ required: true, message: 'Chi phí' }]} className="!mb-0" style={{ width: 180 }}>
                                            <InputNumber min={0} placeholder="Chi phí" className="w-full" formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={val => val.replace(/,/g, '')} />
                                        </Form.Item>
                                        <Button icon={<DeleteOutlined />} danger onClick={() => remove(name)} />
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mb-4">Thêm dịch vụ</Button>
                            </>
                        )}
                    </Form.List>

                    <Form.Item name="thoiGianDuKien" label="Thời gian dự kiến (ngày)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={1} max={60} />
                    </Form.Item>
                    <Form.Item name="ghiChu" label="Ghi chú">
                        <TextArea rows={3} placeholder="Ghi chú thêm..." />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={() => setQuoteModal(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />}>Gửi báo giá</Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal chi tiết báo giá */}
            <Modal
                title={`Chi tiết báo giá - ${selectedQuote?.maBaoGia}`}
                open={detailModal}
                onCancel={() => setDetailModal(false)}
                footer={<Button onClick={() => setDetailModal(false)}>Đóng</Button>}
                width={650}
            >
                {selectedQuote && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div><Text className="text-gray-500">Đơn hàng:</Text><div className="font-mono font-medium">{selectedQuote.donHang?.maVanDon}</div></div>
                            <div><Text className="text-gray-500">Thiết bị:</Text><div className="font-medium">{selectedQuote.donHang?.modelMay}</div></div>
                            <div><Text className="text-gray-500">KTV:</Text><div className="font-medium">{selectedQuote.kyThuatVien?.hoTen}</div></div>
                            <div><Text className="text-gray-500">Trạng thái:</Text><div><Tag color={trangThaiColors[selectedQuote.trangThai]}>{trangThaiLabels[selectedQuote.trangThai]}</Tag></div></div>
                        </div>

                        {selectedQuote.danhSachLinhKien?.length > 0 && (
                            <div>
                                <Text strong>Linh kiện:</Text>
                                <Table
                                    dataSource={selectedQuote.danhSachLinhKien}
                                    rowKey={(_, i) => i}
                                    size="small"
                                    pagination={false}
                                    className="mt-2"
                                    columns={[
                                        { title: 'Tên', dataIndex: 'tenLinhKien' },
                                        { title: 'SL', dataIndex: 'soLuong', width: 60 },
                                        { title: 'Đơn giá', dataIndex: 'donGia', render: v => formatCurrency(v) },
                                        { title: 'Thành tiền', dataIndex: 'thanhTien', render: v => formatCurrency(v) },
                                    ]}
                                />
                            </div>
                        )}

                        {selectedQuote.chiPhiDichVu?.length > 0 && (
                            <div>
                                <Text strong>Dịch vụ:</Text>
                                <Table
                                    dataSource={selectedQuote.chiPhiDichVu}
                                    rowKey={(_, i) => i}
                                    size="small"
                                    pagination={false}
                                    className="mt-2"
                                    columns={[
                                        { title: 'Dịch vụ', dataIndex: 'tenDichVu' },
                                        { title: 'Chi phí', dataIndex: 'chiPhi', render: v => formatCurrency(v) },
                                    ]}
                                />
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 rounded-lg text-right">
                            <div>Linh kiện: <span className="font-semibold">{formatCurrency(selectedQuote.tongChiPhiLinhKien)}</span></div>
                            <div>Dịch vụ: <span className="font-semibold">{formatCurrency(selectedQuote.tongChiPhiDichVu)}</span></div>
                            <div className="text-lg mt-2 pt-2 border-t border-blue-200">
                                Tổng cộng: <span className="font-bold text-blue-600">{formatCurrency(selectedQuote.tongCong)}</span>
                            </div>
                        </div>

                        {selectedQuote.lyDoTuChoi && (
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Text strong className="text-red-600">Lý do từ chối:</Text>
                                <div>{selectedQuote.lyDoTuChoi}</div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal từ chối */}
            <Modal
                title="Từ chối báo giá"
                open={rejectModal}
                onCancel={() => setRejectModal(false)}
                footer={null}
            >
                <Form form={rejectForm} layout="vertical" onFinish={handleSubmitReject} className="mt-4">
                    <Form.Item name="lyDoTuChoi" label="Lý do từ chối" rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}>
                        <TextArea rows={4} placeholder="Nhập lý do từ chối báo giá..." />
                    </Form.Item>
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setRejectModal(false)}>Hủy</Button>
                        <Button danger htmlType="submit" icon={<CloseCircleOutlined />}>Xác nhận từ chối</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default QuoteManagement
