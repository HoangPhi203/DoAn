import { Card, Table, Tag, Button, Typography, Space, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, PhoneOutlined } from '@ant-design/icons'
import { mockAppointments, appointmentStatusLabels, appointmentStatusColors } from '../../data/mockAppointments'

const { Title } = Typography

const AppointmentList = () => {
    const handleConfirm = (id) => {
        message.success(`Đã xác nhận lịch hẹn ${id}`)
    }

    const handleCancel = (id) => {
        message.warning(`Đã hủy lịch hẹn ${id}`)
    }

    const columns = [
        { title: 'Mã', dataIndex: 'id', key: 'id', render: text => <span className="font-mono">{text}</span> },
        { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
        { title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone', render: text => <span><PhoneOutlined className="mr-1" />{text}</span> },
        { title: 'Ngày hẹn', dataIndex: 'date', key: 'date', render: date => new Date(date).toLocaleDateString('vi-VN') },
        { title: 'Giờ', dataIndex: 'time', key: 'time' },
        { title: 'Thiết bị', dataIndex: 'deviceType', key: 'deviceType' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => <Tag color={appointmentStatusColors[status]}>{appointmentStatusLabels[status]}</Tag> },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' && (
                        <>
                            <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleConfirm(record.id)}>Xác nhận</Button>
                            <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleCancel(record.id)}>Hủy</Button>
                        </>
                    )}
                    {record.status === 'confirmed' && <Tag color="green">Đã xác nhận</Tag>}
                </Space>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <Title level={4}>Quản lý lịch hẹn</Title>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table columns={columns} dataSource={mockAppointments} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>
        </div>
    )
}

export default AppointmentList
