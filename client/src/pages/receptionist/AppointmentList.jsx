import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Typography, Space, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, PhoneOutlined } from '@ant-design/icons'

const { Title } = Typography

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setAppointments(data.data)
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
            message.error('Lỗi khi tải danh sách lịch hẹn')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const handleConfirm = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/appointments/${id}/confirm-to-order`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            
            if (data.success) {
                message.success(`Đã xác nhận lịch hẹn và tạo đơn hàng: ${data.data.order.maVanDon}`)
                fetchAppointments() // Reload list
            } else {
                message.error(data.message || 'Có lỗi xảy ra khi xác nhận')
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi kết nối server')
        }
    }

    const handleCancel = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ trangThaiXacNhan: 'DaHuy' })
            })
            const data = await response.json()
            
            if (data.success) {
                message.success('Đã hủy lịch hẹn')
                fetchAppointments()
            } else {
                message.error(data.message || 'Lỗi khi hủy lịch hẹn')
            }
        } catch (error) {
            console.error(error)
            message.error('Lỗi kết nối')
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            'ChoXacNhan': 'orange',
            'DaXacNhan': 'green',
            'DaHuy': 'red',
            'DaHoanThanh': 'blue'
        }
        return colors[status] || 'default'
    }

    const getStatusLabel = (status) => {
        const labels = {
            'ChoXacNhan': 'Chờ xác nhận',
            'DaXacNhan': 'Đã xác nhận',
            'DaHuy': 'Đã hủy',
            'DaHoanThanh': 'Đã hoàn thành'
        }
        return labels[status] || status
    }

    const columns = [
        { title: 'Tên Khách Hàng', dataIndex: 'hoTenKhach', key: 'hoTenKhach', render: (text, record) => text || record.khachHang?.hoTen || 'N/A' },
        { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai', render: text => <span><PhoneOutlined className="mr-1" />{text}</span> },
        { title: 'Ngày hẹn', dataIndex: 'ngayGioHen', key: 'date', render: date => new Date(date).toLocaleDateString('vi-VN') },
        { title: 'Giờ', dataIndex: 'ngayGioHen', key: 'time', render: date => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) },
        { title: 'Thiết bị', dataIndex: 'modelMay', key: 'deviceType', render: text => text || 'Chưa cung cấp' },
        { title: 'Trạng thái', dataIndex: 'trangThaiXacNhan', key: 'status', render: status => <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag> },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.trangThaiXacNhan === 'ChoXacNhan' && (
                        <>
                            <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleConfirm(record._id)}>Xác nhận</Button>
                            <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleCancel(record._id)}>Hủy</Button>
                        </>
                    )}
                    {record.trangThaiXacNhan === 'DaXacNhan' && <Tag color="green">Đã tạo đơn</Tag>}
                </Space>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <Title level={4}>Quản lý lịch hẹn</Title>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table 
                    columns={columns} 
                    dataSource={appointments} 
                    rowKey="_id" 
                    loading={loading}
                    pagination={{ pageSize: 10 }} 
                />
            </Card>
        </div>
    )
}

export default AppointmentList
