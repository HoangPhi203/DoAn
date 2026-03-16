import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Typography, Space, Avatar, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { Title } = Typography
const { Option } = Select

const roleLabels = { admin: 'Admin', receptionist: 'Tiếp tân', technician: 'Kỹ thuật', customer: 'Khách hàng' }
const roleColors = { admin: 'purple', receptionist: 'blue', technician: 'green', customer: 'default' }

const UserManagement = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [form] = Form.useForm()

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/auth/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const result = await response.json()
            if (result.success) {
                setData(result.data)
            }
        } catch (error) {
            message.error('Lỗi khi tải danh sách người dùng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

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

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const result = await response.json()
            if (result.success) {
                message.success('Đã xóa người dùng')
                fetchUsers()
            }
        } catch (error) {
            message.error('Lỗi khi xóa người dùng')
        }
    }

    const handleSave = async (values) => {
        try {
            const token = localStorage.getItem('token')
            const url = editingUser 
                ? `http://localhost:5000/api/auth/users/${editingUser._id}`
                : `http://localhost:5000/api/auth/register`
            
            const method = editingUser ? 'PUT' : 'POST'
            
            // Map labels back to schema fields
            const body = {
                hoTen: values.name,
                email: values.email,
                soDienThoai: values.phone,
                vaiTro: values.role,
                matKhau: values.password
            }

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(body)
            })
            
            const result = await response.json()
            if (result.success) {
                message.success(editingUser ? 'Đã cập nhật' : 'Đã thêm người dùng')
                setModalVisible(false)
                fetchUsers()
            } else {
                message.error(result.message || 'Lỗi xử lý')
            }
        } catch (error) {
            message.error('Lỗi kết nối server')
        }
    }

    const columns = [
        {
            title: 'Tên', dataIndex: 'hoTen', key: 'hoTen', render: (text, record) => (
                <div className="flex items-center gap-2">
                    <Avatar style={{ backgroundColor: '#3b82f6' }}>{text ? text[0] : 'U'}</Avatar>
                    <span>{text}</span>
                </div>
            )
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Điện thoại', dataIndex: 'soDienThoai', key: 'soDienThoai' },
        { 
            title: 'Vai trò', 
            dataIndex: 'vaiTro', 
            key: 'vaiTro', 
            render: role => {
                const roleKey = role === 'KyThuatVien' ? 'technician' : role === 'TiepTan' ? 'receptionist' : role === 'Admin' ? 'admin' : 'customer'
                return <Tag color={roleColors[roleKey]}>{roleLabels[roleKey]}</Tag>
            }
        },
        { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: active => <Tag color={active !== false ? 'green' : 'default'}>{active !== false ? 'Hoạt động' : 'Khóa'}</Tag> },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit({
                        ...record,
                        name: record.hoTen,
                        phone: record.soDienThoai,
                        role: record.vaiTro === 'KyThuatVien' ? 'technician' : record.vaiTro === 'TiepTan' ? 'receptionist' : record.vaiTro === 'Admin' ? 'admin' : 'customer'
                    })}>Sửa</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} disabled={record.vaiTro === 'Admin'}>Xóa</Button>
                </Space>
            )
        },
    ]

    const filteredData = data.filter(u => 
        u.hoTen?.toLowerCase().includes(searchText.toLowerCase()) || 
        u.soDienThoai?.includes(searchText) || 
        u.email?.toLowerCase().includes(searchText.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Title level={4} className="!mb-0">Quản lý người dùng</Title>
                <div className="flex gap-3 w-full md:w-auto">
                    <Input 
                        placeholder="Tìm tên, SĐT, email..." 
                        prefix={<SearchOutlined />} 
                        value={searchText} 
                        onChange={e => setSearchText(e.target.value)} 
                        className="w-full md:w-64"
                        allowClear
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm</Button>
                </div>
            </div>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table columns={columns} dataSource={filteredData} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />
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
                            <Option value="customer">Khách hàng</Option>
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
