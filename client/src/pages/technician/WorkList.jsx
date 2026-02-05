import { useState } from 'react'
import { Card, Table, Tag, Button, Typography, Radio, List, Avatar } from 'antd'
import { UnorderedListOutlined, AppstoreOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { mockOrders, statusLabels, statusColors } from '../../data/mockOrders'

const { Title } = Typography

const WorkList = () => {
    const [viewMode, setViewMode] = useState('list')
    const navigate = useNavigate()

    const workItems = mockOrders.filter(o => ['diagnosing', 'repairing', 'waiting_parts', 'confirmed'].includes(o.status))

    const columns = [
        { title: 'Mã đơn', dataIndex: 'trackingCode', key: 'trackingCode', render: text => <span className="font-mono font-medium">{text}</span> },
        { title: 'Thiết bị', key: 'device', render: (_, r) => `${r.device.brand} ${r.device.model}` },
        { title: 'Lỗi', dataIndex: 'issueDescription', key: 'issue', ellipsis: true },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag> },
        { title: '', key: 'action', render: (_, r) => <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/technician/orders/${r.id}`)}>Chi tiết</Button> },
    ]

    const kanbanColumns = ['confirmed', 'diagnosing', 'repairing', 'waiting_parts']

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={4} className="!mb-0">Danh sách công việc</Title>
                <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                    <Radio.Button value="list"><UnorderedListOutlined /> Danh sách</Radio.Button>
                    <Radio.Button value="kanban"><AppstoreOutlined /> Kanban</Radio.Button>
                </Radio.Group>
            </div>

            {viewMode === 'list' ? (
                <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                    <Table columns={columns} dataSource={workItems} rowKey="id" pagination={{ pageSize: 10 }} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kanbanColumns.map(status => (
                        <Card key={status} title={<Tag color={statusColors[status]}>{statusLabels[status]}</Tag>} size="small" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                            <List itemLayout="horizontal" dataSource={workItems.filter(o => o.status === status)} renderItem={item => (
                                <List.Item className="cursor-pointer hover:bg-gray-50 rounded-lg px-2" onClick={() => navigate(`/technician/orders/${item.id}`)}>
                                    <List.Item.Meta avatar={<Avatar size="small" style={{ backgroundColor: '#3b82f6' }} icon={<ToolOutlined />} />} title={<span className="text-sm">{item.trackingCode}</span>} description={<span className="text-xs">{item.device.brand} {item.device.model}</span>} />
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
