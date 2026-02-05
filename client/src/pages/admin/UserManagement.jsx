import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Typography, Space, Avatar, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { mockUsers } from '../../data/mockUsers'

const { Title } = Typography
const { Option } = Select

const roleLabels = { admin: 'Admin', receptionist: 'Tiếp tân', technician: 'Kỹ thuật', customer: 'Khách hàng' }
const roleColors = { admin: 'purple', receptionist: 'blue', technician: 'green', customer: 'default' }

const UserManagement = () => {
    const [data, setData] = useState(mockUsers)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [form] = Form.useForm()

    const handleAdd = () => {
        setEditingUser(null)
        form.resetFields()
        setModalVisible(true)
    }

    const handleEdit = (record) => {
        setEditingUser(record)
        form.setFieldsValue(record)
        setModalVisible(true)
    }

    const handleDelete = (id) => {
        setData(data.filter(u => u.id !== id))
        message.success('Đã xóa người dùng')
    }

    const handleSave = (values) => {
        if (editingUser) {
            setData(data.map(u => u.id === editingUser.id ? { ...u, ...values } : u))
            message.success('Đã cập nhật')
        } else {
            setData([...data, { ...values, id: `USR-${Date.now()}` }])
            message.success('Đã thêm người dùng')
        }
        setModalVisible(false)
    }

    const columns = [
        {
            title: 'Tên', dataIndex: 'name', key: 'name', render: (text, record) => (
                <div className="flex items-center gap-2">
                    <Avatar style={{ backgroundColor: record.avatar ? undefined : '#3b82f6' }} src={record.avatar}>{text[0]}</Avatar>
                    <span>{text}</span>
                </div>
            )
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role', render: role => <Tag color={roleColors[role]}>{roleLabels[role]}</Tag> },
        { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: active => <Tag color={active ? 'green' : 'default'}>{active ? 'Hoạt động' : 'Khóa'}</Tag> },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} disabled={record.role === 'admin'}>Xóa</Button>
                </Space>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={4} className="!mb-0">Quản lý người dùng</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm người dùng</Button>
            </div>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                        <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="email@example.com" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input placeholder="0901234567" />
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                        <Select placeholder="Chọn vai trò">
                            <Option value="receptionist">Tiếp tân</Option>
                            <Option value="technician">Kỹ thuật viên</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>
                    {!editingUser && (
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>
                    )}
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default UserManagement
