import { Card, Row, Col, Statistic, Table, Tag, Typography, Progress, List, Avatar } from 'antd'
import { DollarOutlined, TeamOutlined, ToolOutlined, AlertOutlined, RiseOutlined } from '@ant-design/icons'
import { mockOrders } from '../../data/mockOrders'
import { mockInventory } from '../../data/mockInventory'
import { mockUsers } from '../../data/mockUsers'

const { Title, Text } = Typography

const AdminDashboard = () => {
    const totalRevenue = mockOrders.filter(o => o.status === 'completed' || o.status === 'delivered').reduce((sum, o) => sum + (o.quote?.totalCost || 0), 0)
    const lowStockItems = mockInventory.filter(i => i.isLowStock)
    const totalStaff = mockUsers.filter(u => u.role !== 'customer').length
    const completedOrders = mockOrders.filter(o => o.status === 'completed' || o.status === 'delivered')

    const technicians = mockUsers.filter(u => u.role === 'technician').slice(0, 5)

    return (
        <div className="space-y-6">
            <Title level={4}>Tổng quan hệ thống</Title>

            <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Doanh thu tháng" value={totalRevenue} prefix={<DollarOutlined className="text-green-500" />} suffix="đ" formatter={v => v.toLocaleString('vi-VN')} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Tồn kho thấp" value={lowStockItems.length} prefix={<AlertOutlined className="text-red-500" />} valueStyle={{ color: lowStockItems.length > 0 ? '#ef4444' : '#10b981' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Nhân viên" value={totalStaff} prefix={<TeamOutlined className="text-blue-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Đơn hoàn thành" value={completedOrders.length} prefix={<ToolOutlined className="text-purple-500" />} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title="Hiệu suất kỹ thuật viên" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <List itemLayout="horizontal" dataSource={technicians} renderItem={item => (
                            <List.Item>
                                <List.Item.Meta avatar={<Avatar style={{ backgroundColor: '#3b82f6' }}>{item.name[0]}</Avatar>} title={item.name} description={item.email} />
                                <div className="text-right">
                                    <div className="font-bold text-green-600">{Math.floor(Math.random() * 20 + 10)} đơn</div>
                                    <Progress percent={Math.floor(Math.random() * 30 + 70)} size="small" showInfo={false} />
                                </div>
                            </List.Item>
                        )} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title={<span><AlertOutlined className="mr-2 text-red-500" />Cảnh báo tồn kho</span>} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        {lowStockItems.length > 0 ? (
                            <List itemLayout="horizontal" dataSource={lowStockItems.slice(0, 5)} renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={item.name} description={`SKU: ${item.sku}`} />
                                    <Tag color="red">Còn {item.quantity}</Tag>
                                </List.Item>
                            )} />
                        ) : (
                            <Text className="text-gray-400">Không có cảnh báo</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default AdminDashboard
