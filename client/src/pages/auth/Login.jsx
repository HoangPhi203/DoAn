import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, Divider, message } from 'antd'
import { PhoneOutlined, LockOutlined, ToolOutlined, LoginOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text, Paragraph } = Typography

const Login = () => {
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const result = await login(values.phone, values.password)
            if (result.success) {
                message.success('Đăng nhập thành công!')
                const routes = { admin: '/admin', receptionist: '/receptionist', technician: '/technician', customer: '/' }
                navigate(routes[result.user.role] || '/')
            } else {
                message.error(result.message)
            }
        } catch {
            message.error('Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 no-underline">
                        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                            <ToolOutlined className="text-2xl text-white" />
                        </div>
                        <div className="text-left">
                            <Title level={3} className="!mb-0 gradient-text">LaptopCare</Title>
                            <Text className="text-gray-500 text-sm">Hệ thống quản lý</Text>
                        </div>
                    </Link>
                </div>

                <Card className="shadow-lg border-0" style={{ borderRadius: 16 }}>
                    <div className="p-2">
                        <Title level={3} className="text-center !mb-2">Đăng nhập</Title>
                        <Paragraph className="text-center text-gray-500 !mb-6">
                            Đăng nhập để sử dụng các tính năng
                        </Paragraph>

                        <Form layout="vertical" size="large" onFinish={handleSubmit}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                                <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0901234567" />
                            </Form.Item>
                            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                                <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Mật khẩu" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading} icon={<LoginOutlined />} className="h-12">
                                Đăng nhập
                            </Button>
                        </Form>

                        <Divider>hoặc</Divider>
                        <div className="text-center">
                            <Text className="text-gray-500">Chưa có tài khoản? </Text>
                            <Link to="/register" className="text-primary-600 font-medium">Đăng ký ngay</Link>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm">
                            <Text strong className="block mb-2">Demo:</Text>
                            <div>Admin: <code>0901234567 / admin123</code></div>
                            <div>Tiếp tân: <code>0912345678 / tieptan123</code></div>
                            <div>Kỹ thuật: <code>0934567890 / kythuat123</code></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Login
