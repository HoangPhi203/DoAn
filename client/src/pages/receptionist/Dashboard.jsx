import { Card, Row, Col, Statistic, Table, Tag, Typography, Progress } from 'antd'
import { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import { mockOrders, statusLabels, statusColors } from '../../data/mockOrders'
import { mockAppointments } from '../../data/mockAppointments'

const { Title } = Typography

const ReceptionistDashboard = () => {
    const todayOrders = mockOrders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    const pendingQuotes = mockOrders.filter(o => o.status === 'pending_quote')
    const completedToday = mockOrders.filter(o => o.status === 'completed')
    const todayAppointments = mockAppointments.filter(a => a.status === 'confirmed')

    const recentOrders = mockOrders.slice(0, 5)

    const columns = [
        { title: 'Mã đơn', dataIndex: 'trackingCode', key: 'trackingCode', render: text => <span className="font-mono font-medium">{text}</span> },
        { title: 'Khách hàng', dataIndex: ['customer', 'name'], key: 'customer' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag> },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: date => new Date(date).toLocaleDateString('vi-VN') },
    ]

    return (
        <div className="space-y-6">
            <Title level={4}>Tổng quan hôm nay</Title>

            <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Đơn mới hôm nay" value={todayOrders.length} prefix={<FileTextOutlined className="text-blue-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Chờ báo giá" value={pendingQuotes.length} prefix={<ClockCircleOutlined className="text-orange-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Hoàn thành" value={completedToday.length} prefix={<CheckCircleOutlined className="text-green-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Lịch hẹn hôm nay" value={todayAppointments.length} prefix={<CalendarOutlined className="text-purple-500" />} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Đơn hàng gần đây" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Table columns={columns} dataSource={recentOrders} rowKey="id" pagination={false} size="small" />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Tiến độ xử lý" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <div className="space-y-4">
                            <div><div className="flex justify-between mb-1"><span>Chờ báo giá</span><span>{pendingQuotes.length}</span></div><Progress percent={30} strokeColor="#f97316" showInfo={false} /></div>
                            <div><div className="flex justify-between mb-1"><span>Đang sửa</span><span>5</span></div><Progress percent={50} strokeColor="#3b82f6" showInfo={false} /></div>
                            <div><div className="flex justify-between mb-1"><span>Hoàn thành</span><span>{completedToday.length}</span></div><Progress percent={80} strokeColor="#10b981" showInfo={false} /></div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ReceptionistDashboard
