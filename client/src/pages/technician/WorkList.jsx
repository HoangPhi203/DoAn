import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Typography, Radio, List, Avatar, message } from 'antd'
import { UnorderedListOutlined, AppstoreOutlined, ToolOutlined, EyeOutlined, SearchOutlined, HistoryOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { Input, Tabs } from 'antd'

const { Title } = Typography

const WorkList = () => {
    const [viewMode, setViewMode] = useState('list')
    const [orders, setOrders] = useState([])
    const [searchText, setSearchText] = useState('')
    const [activeTab, setActiveTab] = useState('active') // 'active' or 'all'
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    
    // Check if we are accessed from admin, receptionist or tech route
    const pathParts = location.pathname.split('/')
    const rolePrefix = pathParts[1] // admin, receptionist, or technician
    const detailRoutePrefix = `/${rolePrefix}/orders`

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const response = await fetch('http://localhost:5000/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if (data.success) {
                    setOrders(data.data)
                }
            } catch (error) {
                console.error('Error fetching orders:', error)
                message.error('Lỗi khi tải danh sách công việc')
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const getStatusColor = (status) => {
        const colors = {
            'ChoBaoGia': 'purple',
            'ChoKhachDuyet': 'orange',
            'DangSua': 'blue',
            'ChoLinhKien': 'volcano',
            'HoanThanh': 'green',
            'DaTraKhach': 'default'
        }
        return colors[status] || 'default'
    }

    const getStatusLabel = (status) => {
        const labels = {
            'ChoBaoGia': 'Chờ kiểm tra',
            'ChoKhachDuyet': 'Chờ KQ Duyệt',
            'DangSua': 'Đang sửa',
            'ChoLinhKien': 'Chờ linh kiện',
            'HoanThanh': 'Hoàn thành',
            'DaTraKhach': 'Đã trả khách'
        }
        return labels[status] || status
    }

    const filteredOrders = orders.filter(o => {
        const matchesSearch = 
            o.maVanDon?.toLowerCase().includes(searchText.toLowerCase()) || 
            o.khachHang?.hoTen?.toLowerCase().includes(searchText.toLowerCase()) || 
            o.khachHang?.soDienThoai?.includes(searchText) ||
            o.modelMay?.toLowerCase().includes(searchText.toLowerCase())
        
        if (activeTab === 'active') {
            return matchesSearch && ['ChoBaoGia', 'ChoKhachDuyet', 'DangSua', 'ChoLinhKien', 'HoanThanh'].includes(o.trangThai)
        }
        return matchesSearch
    })

    const workItems = filteredOrders

    const columns = [
        { title: 'Mã đơn', dataIndex: 'maVanDon', key: 'maVanDon', render: text => <span className="font-mono font-medium">{text}</span> },
        { title: 'Thiết bị', dataIndex: 'modelMay', key: 'device' },
        { title: 'Lỗi', dataIndex: 'tinhTrangLoi', key: 'issue', ellipsis: true },
        { title: 'Trạng thái', dataIndex: 'trangThai', key: 'status', render: status => <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag> },
        { title: 'Phụ trách', dataIndex: 'kyThuatVien', key: 'technician', render: (tech) => tech ? <span className="text-xs">{tech.hoTen}</span> : <Tag color="default" className="text-[10px] italic">Chờ phân công</Tag> },
        { title: '', key: 'action', render: (_, r) => <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => navigate(`${detailRoutePrefix}/${r._id}`)}>Chi tiết</Button> },
    ]

    const kanbanColumns = ['ChoBaoGia', 'ChoKhachDuyet', 'DangSua', 'ChoLinhKien']

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Title level={4} className="!mb-0">Danh sách công việc</Title>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Input 
                        placeholder="Tìm mã đơn, tên, SĐT..." 
                        prefix={<SearchOutlined />} 
                        value={searchText} 
                        onChange={e => setSearchText(e.target.value)} 
                        className="w-full md:w-64"
                        allowClear
                    />
                    <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                        <Radio.Button value="list"><UnorderedListOutlined /> Danh sách</Radio.Button>
                        <Radio.Button value="kanban"><AppstoreOutlined /> Kanban</Radio.Button>
                    </Radio.Group>
                </div>
            </div>

            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
                items={[
                    { key: 'active', label: <span><MedicineBoxOutlined /> Đang xử lý</span> },
                    { key: 'all', label: <span><HistoryOutlined /> Tất cả / Lịch sử</span> }
                ]}
            />

            {viewMode === 'list' ? (
                <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                    <Table columns={columns} dataSource={workItems} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kanbanColumns.map(status => (
                        <Card key={status} title={<Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>} size="small" className="shadow-sm border-0 bg-gray-50 bg-opacity-50" style={{ borderRadius: 12 }}>
                            <List itemLayout="horizontal" dataSource={workItems.filter(o => o.trangThai === status)} renderItem={item => (
                                <List.Item className="cursor-pointer hover:bg-white bg-white mb-2 shadow-sm rounded-lg px-3 border border-gray-100 transition-all" onClick={() => navigate(`${detailRoutePrefix}/${item._id}`)}>
                                    <List.Item.Meta 
                                        avatar={<Avatar size="small" style={{ backgroundColor: '#3b82f6' }} icon={<ToolOutlined />} />} 
                                        title={<span className="text-sm font-medium">{item.maVanDon}</span>} 
                                        description={<span className="text-xs text-gray-500">{item.modelMay}</span>} 
                                    />
                                </List.Item>
                            )} locale={{ emptyText: 'Trống' }} />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WorkList
