import { useState, useEffect, useCallback } from 'react'
import { Card, Table, Tag, Button, Typography, Space, message, Input, Modal, Form, DatePicker, Select, Row, Col, Divider, Descriptions, Timeline, Statistic, Empty, Tooltip } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, SafetyCertificateOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

const API_BASE = 'http://localhost:5000/api'

// Sample warranty data for when the database is empty
const sampleWarranties = [
    {
        _id: 'sample-1',
        maBaoHanh: 'BH-260301-0001',
        donHang: { _id: 'dh-1', maVanDon: 'LC260001', modelMay: 'Dell XPS 15 9520' },
        khachHang: { _id: 'kh-1', hoTen: 'Nguyễn Văn An', soDienThoai: '0901111222' },
        thoiGianBatDau: '2026-01-15T00:00:00.000Z',
        thoiGianKetThuc: '2026-07-15T00:00:00.000Z',
        trangThai: 'ConHan',
        dieuKienBaoHanh: 'Bảo hành lỗi phần cứng do nhà sản xuất, không bao gồm hư hỏng do va đập, nước.',
        ghiChu: 'Thay mainboard - bảo hành 6 tháng',
        lichSuBaoHanh: [
            { ngay: '2026-01-15T10:00:00.000Z', moTa: 'Tiếp nhận phiếu bảo hành', trangThai: 'TiepNhan', chiPhi: 0 },
        ],
        createdAt: '2026-01-15T10:00:00.000Z',
    },
    {
        _id: 'sample-2',
        maBaoHanh: 'BH-260301-0002',
        donHang: { _id: 'dh-2', maVanDon: 'LC260002', modelMay: 'MacBook Pro 14 M3' },
        khachHang: { _id: 'kh-2', hoTen: 'Trần Thị Bình', soDienThoai: '0902222333' },
        thoiGianBatDau: '2026-02-01T00:00:00.000Z',
        thoiGianKetThuc: '2026-05-01T00:00:00.000Z',
        trangThai: 'DangBaoHanh',
        dieuKienBaoHanh: 'Bảo hành thay màn hình, chỉ áp dụng cho lỗi pixel chết.',
        ghiChu: 'Thay màn hình - bảo hành 3 tháng',
        lichSuBaoHanh: [
            { ngay: '2026-02-01T09:00:00.000Z', moTa: 'Tiếp nhận phiếu bảo hành', trangThai: 'TiepNhan', chiPhi: 0 },
            { ngay: '2026-03-10T14:00:00.000Z', moTa: 'Khách mang máy đến kiểm tra, phát hiện lỗi pixel mới', trangThai: 'DangXuLy', chiPhi: 0 },
        ],
        createdAt: '2026-02-01T09:00:00.000Z',
    },
    {
        _id: 'sample-3',
        maBaoHanh: 'BH-260301-0003',
        donHang: { _id: 'dh-3', maVanDon: 'LC260003', modelMay: 'Asus ROG Strix G16' },
        khachHang: { _id: 'kh-3', hoTen: 'Lê Minh Cường', soDienThoai: '0903333444' },
        thoiGianBatDau: '2025-06-01T00:00:00.000Z',
        thoiGianKetThuc: '2025-12-01T00:00:00.000Z',
        trangThai: 'HetHan',
        dieuKienBaoHanh: 'Bảo hành quạt tản nhiệt.',
        ghiChu: 'Thay quạt và keo tản nhiệt - bảo hành 6 tháng',
        lichSuBaoHanh: [
            { ngay: '2025-06-01T10:00:00.000Z', moTa: 'Tiếp nhận phiếu bảo hành', trangThai: 'TiepNhan', chiPhi: 0 },
            { ngay: '2025-09-15T11:00:00.000Z', moTa: 'Khách mang máy kiểm tra tình trạng quạt, hoạt động bình thường', trangThai: 'HoanThanh', chiPhi: 0 },
        ],
        createdAt: '2025-06-01T10:00:00.000Z',
    },
    {
        _id: 'sample-4',
        maBaoHanh: 'BH-260301-0004',
        donHang: { _id: 'dh-4', maVanDon: 'LC260004', modelMay: 'HP Pavilion 15' },
        khachHang: { _id: 'kh-4', hoTen: 'Phạm Hoàng Dung', soDienThoai: '0904444555' },
        thoiGianBatDau: '2026-03-01T00:00:00.000Z',
        thoiGianKetThuc: '2026-09-01T00:00:00.000Z',
        trangThai: 'ConHan',
        dieuKienBaoHanh: 'Bảo hành pin chính hãng, bao gồm lỗi chai pin dưới 80% sau 3 tháng.',
        ghiChu: 'Thay pin mới - bảo hành 6 tháng',
        lichSuBaoHanh: [
            { ngay: '2026-03-01T08:30:00.000Z', moTa: 'Tiếp nhận phiếu bảo hành', trangThai: 'TiepNhan', chiPhi: 0 },
        ],
        createdAt: '2026-03-01T08:30:00.000Z',
    },
    {
        _id: 'sample-5',
        maBaoHanh: 'BH-260301-0005',
        donHang: { _id: 'dh-5', maVanDon: 'LC260005', modelMay: 'Lenovo ThinkPad X1 Carbon' },
        khachHang: { _id: 'kh-5', hoTen: 'Hoàng Văn Em', soDienThoai: '0905555666' },
        thoiGianBatDau: '2026-01-10T00:00:00.000Z',
        thoiGianKetThuc: '2026-04-10T00:00:00.000Z',
        trangThai: 'HuyBaoHanh',
        dieuKienBaoHanh: 'Bảo hành bàn phím.',
        ghiChu: 'Khách yêu cầu hủy vì đổi máy mới',
        lichSuBaoHanh: [
            { ngay: '2026-01-10T10:00:00.000Z', moTa: 'Tiếp nhận phiếu bảo hành', trangThai: 'TiepNhan', chiPhi: 0 },
        ],
        createdAt: '2026-01-10T10:00:00.000Z',
    }
]

const WarrantyManagement = () => {
    const [warranties, setWarranties] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [detailModal, setDetailModal] = useState({ open: false, data: null })
    const [createModal, setCreateModal] = useState(false)
    const [editModal, setEditModal] = useState({ open: false, data: null })
    const [historyModal, setHistoryModal] = useState({ open: false, data: null })
    const [createForm] = Form.useForm()
    const [editForm] = Form.useForm()
    const [historyForm] = Form.useForm()
    const { user } = useAuth()
    const [usingSampleData, setUsingSampleData] = useState(false)

    const getToken = () => localStorage.getItem('token')

    const fetchHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }), [])

    const fetchWarranties = useCallback(async () => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            if (statusFilter) queryParams.set('trangThai', statusFilter)
            const res = await fetch(`${API_BASE}/warranty?${queryParams}`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success && data.data.length > 0) {
                setWarranties(data.data)
                setUsingSampleData(false)
            } else {
                // Use sample data when database is empty
                setWarranties(sampleWarranties)
                setUsingSampleData(true)
            }
        } catch {
            // Fallback to sample data on error
            setWarranties(sampleWarranties)
            setUsingSampleData(true)
        } finally {
            setLoading(false)
        }
    }, [fetchHeaders, statusFilter])

    useEffect(() => {
        fetchWarranties()
    }, [fetchWarranties])

    // CREATE WARRANTY
    const handleCreate = async () => {
        try {
            const values = await createForm.validateFields()
            if (usingSampleData) {
                // Create with sample data mode
                const newWarranty = {
                    _id: `sample-${Date.now()}`,
                    maBaoHanh: `BH-${dayjs().format('YYMMDD')}-${String(warranties.length + 1).padStart(4, '0')}`,
                    donHang: { _id: `dh-new`, maVanDon: values.maVanDon || 'LC-NEW', modelMay: values.modelMay || 'N/A' },
                    khachHang: { _id: `kh-new`, hoTen: values.hoTenKhach || 'N/A', soDienThoai: values.soDienThoai || 'N/A' },
                    thoiGianBatDau: values.thoiGianBatDau.toISOString(),
                    thoiGianKetThuc: values.thoiGianKetThuc.toISOString(),
                    trangThai: 'ConHan',
                    dieuKienBaoHanh: values.dieuKienBaoHanh || '',
                    ghiChu: values.ghiChu || '',
                    lichSuBaoHanh: [{ ngay: new Date().toISOString(), moTa: 'Tiếp nhận phiếu bảo hành', trangThai: 'TiepNhan', chiPhi: 0 }],
                    createdAt: new Date().toISOString(),
                }
                setWarranties(prev => [newWarranty, ...prev])
                message.success(`Đã tạo phiếu bảo hành ${newWarranty.maBaoHanh}`)
            } else {
                const res = await fetch(`${API_BASE}/warranty`, {
                    method: 'POST',
                    headers: fetchHeaders(),
                    body: JSON.stringify({
                        donHangId: values.donHangId,
                        thoiGianBatDau: values.thoiGianBatDau.toISOString(),
                        thoiGianKetThuc: values.thoiGianKetThuc.toISOString(),
                        dieuKienBaoHanh: values.dieuKienBaoHanh,
                        ghiChu: values.ghiChu
                    })
                })
                const data = await res.json()
                if (data.success) {
                    message.success(data.message)
                    fetchWarranties()
                } else {
                    message.error(data.message)
                    return
                }
            }
            setCreateModal(false)
            createForm.resetFields()
        } catch (err) {
            if (err.errorFields) return // form validation error
            message.error('Lỗi khi tạo phiếu bảo hành')
        }
    }

    // UPDATE WARRANTY
    const handleEdit = async () => {
        try {
            const values = await editForm.validateFields()
            const id = editModal.data._id
            if (usingSampleData || id.startsWith('sample-')) {
                setWarranties(prev => prev.map(w => w._id === id ? {
                    ...w,
                    thoiGianKetThuc: values.thoiGianKetThuc.toISOString(),
                    trangThai: values.trangThai,
                    dieuKienBaoHanh: values.dieuKienBaoHanh || w.dieuKienBaoHanh,
                    ghiChu: values.ghiChu || w.ghiChu,
                } : w))
                message.success('Đã cập nhật phiếu bảo hành')
            } else {
                const res = await fetch(`${API_BASE}/warranty/${id}`, {
                    method: 'PUT',
                    headers: fetchHeaders(),
                    body: JSON.stringify({
                        thoiGianKetThuc: values.thoiGianKetThuc.toISOString(),
                        trangThai: values.trangThai,
                        dieuKienBaoHanh: values.dieuKienBaoHanh,
                        ghiChu: values.ghiChu
                    })
                })
                const data = await res.json()
                if (data.success) {
                    message.success(data.message)
                    fetchWarranties()
                } else {
                    message.error(data.message)
                    return
                }
            }
            setEditModal({ open: false, data: null })
        } catch (err) {
            if (err.errorFields) return
            message.error('Lỗi khi cập nhật')
        }
    }

    // DELETE WARRANTY
    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xóa phiếu bảo hành',
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn xóa phiếu bảo hành ${record.maBaoHanh}? Thao tác này không thể hoàn tác.`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                if (usingSampleData || record._id.startsWith('sample-')) {
                    setWarranties(prev => prev.filter(w => w._id !== record._id))
                    message.success('Đã xóa phiếu bảo hành')
                } else {
                    try {
                        const res = await fetch(`${API_BASE}/warranty/${record._id}`, {
                            method: 'DELETE',
                            headers: fetchHeaders()
                        })
                        if (res.ok) {
                            message.success('Đã xóa phiếu bảo hành')
                            fetchWarranties()
                        }
                    } catch {
                        message.error('Lỗi khi xóa')
                    }
                }
            }
        })
    }

    // CANCEL WARRANTY
    const handleCancel = (record) => {
        Modal.confirm({
            title: 'Hủy bảo hành',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn hủy phiếu bảo hành này?',
            okText: 'Đồng ý',
            okType: 'danger',
            cancelText: 'Quay lại',
            onOk: async () => {
                if (usingSampleData || record._id.startsWith('sample-')) {
                    setWarranties(prev => prev.map(w => w._id === record._id ? { ...w, trangThai: 'HuyBaoHanh' } : w))
                    message.success('Đã hủy bảo hành')
                } else {
                    try {
                        const res = await fetch(`${API_BASE}/warranty/${record._id}`, {
                            method: 'PUT',
                            headers: fetchHeaders(),
                            body: JSON.stringify({ trangThai: 'HuyBaoHanh' })
                        })
                        if (res.ok) {
                            message.success('Đã hủy bảo hành')
                            fetchWarranties()
                        }
                    } catch {
                        message.error('Lỗi khi hủy bảo hành')
                    }
                }
            }
        })
    }

    // ADD HISTORY
    const handleAddHistory = async () => {
        try {
            const values = await historyForm.validateFields()
            const id = historyModal.data._id
            if (usingSampleData || id.startsWith('sample-')) {
                setWarranties(prev => prev.map(w => {
                    if (w._id === id) {
                        const newHistory = {
                            ngay: new Date().toISOString(),
                            moTa: values.moTa,
                            trangThai: values.trangThai,
                            chiPhi: values.chiPhi || 0
                        }
                        return {
                            ...w,
                            lichSuBaoHanh: [...(w.lichSuBaoHanh || []), newHistory],
                            trangThai: values.trangThai === 'DangXuLy' ? 'DangBaoHanh' : w.trangThai
                        }
                    }
                    return w
                }))
                message.success('Đã thêm lịch sử bảo hành')
            } else {
                const res = await fetch(`${API_BASE}/warranty/${id}/history`, {
                    method: 'POST',
                    headers: fetchHeaders(),
                    body: JSON.stringify(values)
                })
                const data = await res.json()
                if (data.success) {
                    message.success(data.message)
                    fetchWarranties()
                } else {
                    message.error(data.message)
                    return
                }
            }
            setHistoryModal({ open: false, data: null })
            historyForm.resetFields()
        } catch (err) {
            if (err.errorFields) return
            message.error('Lỗi khi thêm lịch sử')
        }
    }

    const trangThaiColors = {
        'ConHan': 'green',
        'HetHan': 'red',
        'DangBaoHanh': 'orange',
        'HuyBaoHanh': 'default'
    }

    const trangThaiLabels = {
        'ConHan': 'Còn hạn',
        'HetHan': 'Hết hạn',
        'DangBaoHanh': 'Đang bảo hành',
        'HuyBaoHanh': 'Đã hủy'
    }

    const historyStatusLabels = {
        'TiepNhan': 'Tiếp nhận',
        'DangXuLy': 'Đang xử lý',
        'HoanThanh': 'Hoàn thành'
    }

    const historyStatusColors = {
        'TiepNhan': 'blue',
        'DangXuLy': 'orange',
        'HoanThanh': 'green'
    }

    const getSoNgayConLai = (endDate, status) => {
        if (status === 'HuyBaoHanh') return 0
        const diff = new Date(endDate) - new Date()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    const columns = [
        {
            title: 'Mã BH',
            dataIndex: 'maBaoHanh',
            key: 'maBaoHanh',
            render: text => <span className="font-mono font-medium text-primary-600">{text}</span>,
            width: 160,
        },
        {
            title: 'Đơn hàng',
            key: 'donHang',
            render: (_, record) => (
                <div>
                    <div className="font-mono text-sm">{record.donHang?.maVanDon || 'N/A'}</div>
                    <div className="text-xs text-gray-400">{record.donHang?.modelMay || ''}</div>
                </div>
            ),
            width: 160,
        },
        {
            title: 'Khách hàng',
            key: 'khachHang',
            render: (_, record) => (
                <div>
                    <div className="font-medium">{record.khachHang?.hoTen || 'N/A'}</div>
                    <div className="text-xs text-gray-400">{record.khachHang?.soDienThoai || ''}</div>
                </div>
            ),
            width: 160,
        },
        {
            title: 'Thời hạn',
            key: 'thoiHan',
            render: (_, record) => {
                const daysLeft = getSoNgayConLai(record.thoiGianKetThuc, record.trangThai)
                return (
                    <div>
                        <div className="text-sm">{dayjs(record.thoiGianBatDau).format('DD/MM/YY')} → {dayjs(record.thoiGianKetThuc).format('DD/MM/YY')}</div>
                        <div className={`text-xs font-medium ${daysLeft > 30 ? 'text-green-600' : daysLeft > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                            {record.trangThai === 'HuyBaoHanh' ? 'Đã hủy' : daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hết hạn'}
                        </div>
                    </div>
                )
            },
            width: 170,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: status => <Tag color={trangThaiColors[status]}>{trangThaiLabels[status]}</Tag>,
            width: 120,
            filters: [
                { text: 'Còn hạn', value: 'ConHan' },
                { text: 'Hết hạn', value: 'HetHan' },
                { text: 'Đang bảo hành', value: 'DangBaoHanh' },
                { text: 'Đã hủy', value: 'HuyBaoHanh' },
            ],
            onFilter: (value, record) => record.trangThai === value,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space wrap>
                    <Tooltip title="Chi tiết">
                        <Button size="small" icon={<EyeOutlined />} onClick={() => setDetailModal({ open: true, data: record })} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button size="small" icon={<EditOutlined />} onClick={() => {
                            setEditModal({ open: true, data: record })
                            editForm.setFieldsValue({
                                thoiGianKetThuc: dayjs(record.thoiGianKetThuc),
                                trangThai: record.trangThai,
                                dieuKienBaoHanh: record.dieuKienBaoHanh,
                                ghiChu: record.ghiChu,
                            })
                        }} />
                    </Tooltip>
                    {(record.trangThai === 'ConHan' || record.trangThai === 'DangBaoHanh') && (
                        <Tooltip title="Thêm lịch sử">
                            <Button size="small" icon={<HistoryOutlined />} onClick={() => {
                                setHistoryModal({ open: true, data: record })
                                historyForm.resetFields()
                            }} />
                        </Tooltip>
                    )}
                    {record.trangThai === 'ConHan' && (
                        <Tooltip title="Hủy BH">
                            <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleCancel(record)} />
                        </Tooltip>
                    )}
                    <Tooltip title="Xóa">
                        <Button danger size="small" type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const filteredWarranties = warranties.filter(w =>
        w.maBaoHanh?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.donHang?.maVanDon?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.khachHang?.hoTen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.khachHang?.soDienThoai?.includes(searchQuery)
    )

    // Stats
    const totalActive = warranties.filter(w => w.trangThai === 'ConHan').length
    const totalExpired = warranties.filter(w => w.trangThai === 'HetHan').length
    const totalInProgress = warranties.filter(w => w.trangThai === 'DangBaoHanh').length
    const totalCancelled = warranties.filter(w => w.trangThai === 'HuyBaoHanh').length

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={4} className="!mb-0">Quản lý Bảo hành</Title>
                    <Text className="text-gray-500">Quản lý toàn bộ phiếu bảo hành, theo dõi tình trạng và lịch sử xử lý</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} className="gradient-primary border-0" onClick={() => { setCreateModal(true); createForm.resetFields() }}>
                    Tạo phiếu bảo hành
                </Button>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Còn hạn" value={totalActive} prefix={<CheckCircleOutlined className="text-green-500" />} valueStyle={{ color: '#10b981' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Đang bảo hành" value={totalInProgress} prefix={<SyncOutlined className="text-orange-500" />} valueStyle={{ color: '#f59e0b' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Hết hạn" value={totalExpired} prefix={<ExclamationCircleOutlined className="text-red-500" />} valueStyle={{ color: '#ef4444' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Đã hủy" value={totalCancelled} prefix={<CloseCircleOutlined className="text-gray-400" />} />
                    </Card>
                </Col>
            </Row>

            {/* Table */}
            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                    <Search
                        placeholder="Tìm theo Mã BH, Mã Đơn, tên KH, SĐT..."
                        allowClear
                        className="max-w-md"
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Space>
                        <Select placeholder="Lọc trạng thái" allowClear style={{ width: 160 }} onChange={v => setStatusFilter(v || '')}>
                            <Option value="ConHan">Còn hạn</Option>
                            <Option value="HetHan">Hết hạn</Option>
                            <Option value="DangBaoHanh">Đang bảo hành</Option>
                            <Option value="HuyBaoHanh">Đã hủy</Option>
                        </Select>
                        <Button icon={<SyncOutlined />} onClick={fetchWarranties}>Làm mới</Button>
                    </Space>
                </div>

                {usingSampleData && (
                    <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <strong>Lưu ý:</strong> Đang hiển thị dữ liệu mẫu. Khi có đơn hàng thực trong hệ thống, dữ liệu sẽ được lấy từ database.
                    </div>
                )}

                <Table
                    columns={columns}
                    dataSource={filteredWarranties}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: total => `Tổng ${total} phiếu` }}
                    scroll={{ x: 900 }}
                />
            </Card>

            {/* DETAIL MODAL */}
            <Modal
                title={<span><SafetyCertificateOutlined className="mr-2 text-primary-600" />Chi tiết phiếu bảo hành</span>}
                open={detailModal.open}
                onCancel={() => setDetailModal({ open: false, data: null })}
                footer={<Button onClick={() => setDetailModal({ open: false, data: null })}>Đóng</Button>}
                width={700}
            >
                {detailModal.data && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text className="text-gray-500 text-xs block">Mã bảo hành</Text>
                                    <Text strong className="text-primary-600 font-mono text-lg">{detailModal.data.maBaoHanh}</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Tag color={trangThaiColors[detailModal.data.trangThai]} className="text-base px-3 py-0.5">
                                        {trangThaiLabels[detailModal.data.trangThai]}
                                    </Tag>
                                </Col>
                            </Row>
                        </div>

                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Đơn hàng">{detailModal.data.donHang?.maVanDon || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Thiết bị">{detailModal.data.donHang?.modelMay || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Khách hàng">{detailModal.data.khachHang?.hoTen || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="SĐT">{detailModal.data.khachHang?.soDienThoai || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày bắt đầu">{dayjs(detailModal.data.thoiGianBatDau).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Ngày kết thúc">{dayjs(detailModal.data.thoiGianKetThuc).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Ngày còn lại" span={2}>
                                <Text strong className={getSoNgayConLai(detailModal.data.thoiGianKetThuc, detailModal.data.trangThai) > 0 ? 'text-green-600' : 'text-red-500'}>
                                    {getSoNgayConLai(detailModal.data.thoiGianKetThuc, detailModal.data.trangThai)} ngày
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Điều kiện BH" span={2}>{detailModal.data.dieuKienBaoHanh || 'Không có'}</Descriptions.Item>
                            <Descriptions.Item label="Ghi chú" span={2}>{detailModal.data.ghiChu || 'Không có'}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Lịch sử bảo hành</Divider>
                        {detailModal.data.lichSuBaoHanh?.length > 0 ? (
                            <Timeline
                                items={detailModal.data.lichSuBaoHanh.map((h, i) => ({
                                    color: historyStatusColors[h.trangThai] || 'blue',
                                    children: (
                                        <div key={i}>
                                            <div className="font-medium">{h.moTa}</div>
                                            <div className="text-xs text-gray-500">
                                                {dayjs(h.ngay).format('DD/MM/YYYY HH:mm')}
                                                <Tag color={historyStatusColors[h.trangThai]} className="ml-2" size="small">{historyStatusLabels[h.trangThai]}</Tag>
                                                {h.chiPhi > 0 && <span className="ml-2 text-primary-600">{h.chiPhi.toLocaleString('vi-VN')}đ</span>}
                                            </div>
                                        </div>
                                    )
                                }))}
                            />
                        ) : (
                            <Empty description="Chưa có lịch sử" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                )}
            </Modal>

            {/* CREATE MODAL */}
            <Modal
                title={<span><PlusOutlined className="mr-2" />Tạo phiếu bảo hành mới</span>}
                open={createModal}
                onOk={handleCreate}
                onCancel={() => setCreateModal(false)}
                okText="Tạo phiếu"
                cancelText="Hủy"
                width={600}
            >
                <Form form={createForm} layout="vertical" className="mt-4">
                    {usingSampleData ? (
                        <>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="maVanDon" label="Mã vận đơn" rules={[{ required: true, message: 'Nhập mã vận đơn' }]}>
                                        <Input placeholder="VD: LC260010" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="modelMay" label="Model thiết bị" rules={[{ required: true, message: 'Nhập model' }]}>
                                        <Input placeholder="VD: Dell XPS 15" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="hoTenKhach" label="Tên khách hàng" rules={[{ required: true, message: 'Nhập tên' }]}>
                                        <Input placeholder="Nguyễn Văn A" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}>
                                        <Input placeholder="0901234567" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <Form.Item name="donHangId" label="Mã đơn hàng (ID)" rules={[{ required: true, message: 'Nhập ID đơn hàng' }]}>
                            <Input placeholder="Nhập ID đơn hàng đã hoàn thành" />
                        </Form.Item>
                    )}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="thoiGianBatDau" label="Ngày bắt đầu BH" rules={[{ required: true, message: 'Chọn ngày' }]} initialValue={dayjs()}>
                                <DatePicker className="w-full" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="thoiGianKetThuc" label="Ngày kết thúc BH" rules={[{ required: true, message: 'Chọn ngày' }]} initialValue={dayjs().add(6, 'month')}>
                                <DatePicker className="w-full" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="dieuKienBaoHanh" label="Điều kiện bảo hành">
                        <TextArea rows={2} placeholder="VD: Bảo hành lỗi phần cứng, không bao gồm hư hỏng do va đập..." />
                    </Form.Item>
                    <Form.Item name="ghiChu" label="Ghi chú">
                        <TextArea rows={2} placeholder="Ghi chú thêm..." />
                    </Form.Item>
                </Form>
            </Modal>

            {/* EDIT MODAL */}
            <Modal
                title={<span><EditOutlined className="mr-2" />Chỉnh sửa phiếu bảo hành</span>}
                open={editModal.open}
                onOk={handleEdit}
                onCancel={() => setEditModal({ open: false, data: null })}
                okText="Cập nhật"
                cancelText="Hủy"
                width={600}
            >
                <Form form={editForm} layout="vertical" className="mt-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="thoiGianKetThuc" label="Ngày kết thúc BH" rules={[{ required: true }]}>
                                <DatePicker className="w-full" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="ConHan">Còn hạn</Option>
                                    <Option value="HetHan">Hết hạn</Option>
                                    <Option value="DangBaoHanh">Đang bảo hành</Option>
                                    <Option value="HuyBaoHanh">Đã hủy</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="dieuKienBaoHanh" label="Điều kiện bảo hành">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="ghiChu" label="Ghi chú">
                        <TextArea rows={2} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* ADD HISTORY MODAL */}
            <Modal
                title={<span><HistoryOutlined className="mr-2" />Thêm lịch sử bảo hành</span>}
                open={historyModal.open}
                onOk={handleAddHistory}
                onCancel={() => setHistoryModal({ open: false, data: null })}
                okText="Thêm"
                cancelText="Hủy"
                width={500}
            >
                <Form form={historyForm} layout="vertical" className="mt-4">
                    <Form.Item name="moTa" label="Mô tả nội dung" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                        <TextArea rows={3} placeholder="VD: Khách mang máy đến kiểm tra, phát hiện lỗi..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="trangThai" label="Trạng thái" initialValue="TiepNhan" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="TiepNhan">Tiếp nhận</Option>
                                    <Option value="DangXuLy">Đang xử lý</Option>
                                    <Option value="HoanThanh">Hoàn thành</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="chiPhi" label="Chi phí (nếu có)" initialValue={0}>
                                <Input type="number" suffix="đ" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}

export default WarrantyManagement
