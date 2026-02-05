import { Card, Row, Col, Statistic, Table, Tag, Typography, Progress, List, Avatar } from 'antd'
import { ToolOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { mockOrders, statusLabels, statusColors } from '../../data/mockOrders'

const { Title, Text } = Typography

const TechnicianDashboard = () => {
    const myOrders = mockOrders.filter(o => ['diagnosing', 'repairing', 'waiting_parts'].includes(o.status))
    const waitingParts = mockOrders.filter(o => o.status === 'waiting_parts')
    const completed = mockOrders.filter(o => o.status === 'completed')

    const assignedTasks = myOrders.slice(0, 5)

    return (
        <div className="space-y-6">
            <Title level={4}>Công việc của tôi</Title>

            <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Đang xử lý" value={myOrders.length} prefix={<ToolOutlined className="text-blue-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Chờ linh kiện" value={waitingParts.length} prefix={<ClockCircleOutlined className="text-orange-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Hoàn thành" value={completed.length} prefix={<CheckCircleOutlined className="text-green-500" />} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Hiệu suất" value={85} suffix="%" prefix={<ExclamationCircleOutlined className="text-purple-500" />} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Công việc được giao" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <List itemLayout="horizontal" dataSource={assignedTasks} renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar style={{ backgroundColor: '#3b82f6' }} icon={<ToolOutlined />} />}
                                    title={<span className="font-medium">{item.trackingCode} - {item.device.brand} {item.device.model}</span>}
                                    description={item.issueDescription.slice(0, 60) + '...'}
                                />
                                <Tag color={statusColors[item.status]}>{statusLabels[item.status]}</Tag>
                            </List.Item>
                        )} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Tiến độ tháng này" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <div className="text-center mb-4">
                            <Progress type="circle" percent={75} strokeColor="#3b82f6" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between"><Text className="text-gray-500">Hoàn thành</Text><Text strong>{completed.length}</Text></div>
                            <div className="flex justify-between"><Text className="text-gray-500">Đang làm</Text><Text strong>{myOrders.length}</Text></div>
                            <div className="flex justify-between"><Text className="text-gray-500">Đúng hạn</Text><Text strong className="text-green-600">90%</Text></div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default TechnicianDashboard
