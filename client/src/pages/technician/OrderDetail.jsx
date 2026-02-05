import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, Select, Input, Timeline, Typography, Divider, Row, Col, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, LaptopOutlined, UserOutlined } from '@ant-design/icons'
import { mockOrders, statusLabels, statusColors } from '../../data/mockOrders'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const OrderDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const order = mockOrders.find(o => o.id === id) || mockOrders[0]

    const [status, setStatus] = useState(order.status)
    const [note, setNote] = useState('')

    const handleUpdateStatus = () => {
        message.success('Đã cập nhật trạng thái')
    }

    const handleAddNote = () => {
        if (note.trim()) {
            message.success('Đã thêm ghi chú')
            setNote('')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
                <Title level={4} className="!mb-0">Chi tiết đơn hàng: {order.trackingCode}</Title>
                <Tag color={statusColors[order.status]} className="ml-auto">{statusLabels[order.status]}</Tag>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title={<span><LaptopOutlined className="mr-2" />Thông tin thiết bị</span>} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Hãng">{order.device.brand}</Descriptions.Item>
                            <Descriptions.Item label="Model">{order.device.model}</Descriptions.Item>
                            <Descriptions.Item label="Serial">{order.device.serial || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Phụ kiện">{order.device.accessories || 'Không có'}</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <div><Text strong>Mô tả lỗi:</Text><Paragraph className="mt-2 p-3 bg-gray-50 rounded-lg">{order.issueDescription}</Paragraph></div>
                    </Card>

                    <Card title="Cập nhật trạng thái" className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                        <div className="flex gap-4 mb-4">
                            <Select value={status} onChange={setStatus} className="w-48">
                                <Option value="diagnosing">Đang chẩn đoán</Option>
                                <Option value="repairing">Đang sửa chữa</Option>
                                <Option value="waiting_parts">Chờ linh kiện</Option>
                                <Option value="completed">Hoàn thành</Option>
                            </Select>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleUpdateStatus}>Cập nhật</Button>
                        </div>
                        <TextArea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Thêm ghi chú..." />
                        <Button className="mt-2" onClick={handleAddNote}>Thêm ghi chú</Button>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title={<span><UserOutlined className="mr-2" />Khách hàng</span>} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <div className="space-y-2">
                            <div><Text className="text-gray-500">Tên:</Text> <Text strong>{order.customer.name}</Text></div>
                            <div><Text className="text-gray-500">SĐT:</Text> <Text>{order.customer.phone}</Text></div>
                            <div><Text className="text-gray-500">Email:</Text> <Text>{order.customer.email}</Text></div>
                        </div>
                    </Card>

                    <Card title="Lịch sử ghi chú" className="shadow-sm border-0 mt-4" style={{ borderRadius: 12 }}>
                        {order.notes.length > 0 ? (
                            <Timeline items={order.notes.map(n => ({ children: <div><div className="text-sm">{n.text}</div><div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString('vi-VN')}</div></div> }))} />
                        ) : (
                            <Text className="text-gray-400">Chưa có ghi chú</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderDetail
