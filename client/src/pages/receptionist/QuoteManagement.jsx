import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, InputNumber, Input, Typography, Space, message } from 'antd'
import { FileTextOutlined, SendOutlined, EyeOutlined } from '@ant-design/icons'
import { mockOrders, statusLabels, statusColors } from '../../data/mockOrders'

const { Title, Text } = Typography
const { TextArea } = Input

const QuoteManagement = () => {
    const [quoteModal, setQuoteModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [form] = Form.useForm()

    const pendingQuotes = mockOrders.filter(o => o.status === 'pending_quote' || o.status === 'quoted')

    const handleCreateQuote = (order) => {
        setSelectedOrder(order)
        setQuoteModal(true)
    }

    const handleSendQuote = (values) => {
        console.log('Quote:', { ...values, orderId: selectedOrder.id })
        message.success('Đã gửi báo giá thành công!')
        setQuoteModal(false)
        form.resetFields()
    }

    const columns = [
        { title: 'Mã đơn', dataIndex: 'trackingCode', key: 'trackingCode', render: text => <span className="font-mono font-medium">{text}</span> },
        { title: 'Khách hàng', dataIndex: ['customer', 'name'], key: 'customer' },
        { title: 'Thiết bị', key: 'device', render: (_, record) => `${record.device.brand} ${record.device.model}` },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag> },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />}>Xem</Button>
                    {record.status === 'pending_quote' && (
                        <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => handleCreateQuote(record)}>Báo giá</Button>
                    )}
                    {record.status === 'quoted' && (
                        <Button size="small" icon={<SendOutlined />}>Gửi lại</Button>
                    )}
                </Space>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <Title level={4}>Quản lý báo giá</Title>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table columns={columns} dataSource={pendingQuotes} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={`Tạo báo giá - ${selectedOrder?.trackingCode}`} open={quoteModal} onCancel={() => setQuoteModal(false)} footer={null} width={600}>
                <Form form={form} layout="vertical" onFinish={handleSendQuote} className="mt-4">
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div><Text className="text-gray-500">Thiết bị:</Text><div className="font-medium">{selectedOrder?.device.brand} {selectedOrder?.device.model}</div></div>
                        <div><Text className="text-gray-500">Lỗi:</Text><div className="font-medium">{selectedOrder?.issueDescription.slice(0, 50)}...</div></div>
                    </div>

                    <Form.Item name="partsCost" label="Chi phí linh kiện" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={0} formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={val => val.replace(/,/g, '')} addonAfter="đ" />
                    </Form.Item>
                    <Form.Item name="laborCost" label="Chi phí nhân công" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={0} formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={val => val.replace(/,/g, '')} addonAfter="đ" />
                    </Form.Item>
                    <Form.Item name="estimatedDays" label="Thời gian dự kiến (ngày)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={1} max={30} />
                    </Form.Item>
                    <Form.Item name="notes" label="Ghi chú">
                        <TextArea rows={3} placeholder="Ghi chú thêm..." />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={() => setQuoteModal(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />}>Gửi báo giá</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default QuoteManagement
