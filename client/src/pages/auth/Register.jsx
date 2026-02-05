import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, Divider, Steps, message } from 'antd'
import { UserOutlined, PhoneOutlined, LockOutlined, MailOutlined, ToolOutlined, SafetyOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text } = Typography

const Register = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        try {
            await form.validateFields(['phone'])
            setLoading(true)
            await new Promise(r => setTimeout(r, 1000))
            message.success('Đã gửi mã OTP (Demo: 123456)')
            setCurrentStep(1)
        } catch { } finally { setLoading(false) }
    }

    const handleVerifyOtp = async () => {
        const otp = form.getFieldValue('otp')
        if (otp !== '123456') { message.error('Mã OTP không đúng'); return }
        setCurrentStep(2)
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)
            const result = await register(values)
            if (result.success) {
                message.success('Đăng ký thành công!')
                navigate('/')
            } else { message.error(result.message) }
        } catch { } finally { setLoading(false) }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 no-underline">
                        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                            <ToolOutlined className="text-2xl text-white" />
                        </div>
                        <Title level={3} className="!mb-0 gradient-text">LaptopCare</Title>
                    </Link>
                </div>

                <Card className="shadow-lg border-0" style={{ borderRadius: 16 }}>
                    <Title level={3} className="text-center !mb-4">Đăng ký tài khoản</Title>

                    <Steps current={currentStep} size="small" className="mb-6"
                        items={[{ title: 'SĐT' }, { title: 'Xác thực' }, { title: 'Hoàn tất' }]} />

                    <Form form={form} layout="vertical" size="large">
                        {currentStep === 0 && (
                            <>
                                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}>
                                    <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0901234567" />
                                </Form.Item>
                                <Button type="primary" block onClick={handleSendOtp} loading={loading} className="h-12">
                                    Gửi mã OTP
                                </Button>
                            </>
                        )}

                        {currentStep === 1 && (
                            <>
                                <div className="text-center mb-4 p-4 bg-blue-50 rounded-xl">
                                    <SafetyOutlined className="text-2xl text-blue-600 mb-2" />
                                    <div className="text-sm text-gray-600">Mã OTP đã gửi đến {form.getFieldValue('phone')}</div>
                                    <div className="text-xs text-gray-400 mt-1">Demo: nhập 123456</div>
                                </div>
                                <Form.Item name="otp" label="Mã OTP" rules={[{ required: true, message: 'Nhập OTP' }]}>
                                    <Input placeholder="123456" maxLength={6} className="text-center text-xl tracking-widest" />
                                </Form.Item>
                                <Button type="primary" block onClick={handleVerifyOtp} className="h-12">Xác thực</Button>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                                    <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" />
                                </Form.Item>
                                <Form.Item name="email" label="Email">
                                    <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="email@example.com" />
                                </Form.Item>
                                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự' }]}>
                                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} />
                                </Form.Item>
                                <Form.Item name="confirmPassword" label="Xác nhận mật khẩu"
                                    rules={[{ required: true }, ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) return Promise.resolve()
                                            return Promise.reject('Mật khẩu không khớp')
                                        }
                                    })]}>
                                    <Input.Password prefix={<LockOutlined className="text-gray-400" />} />
                                </Form.Item>
                                <Button type="primary" block onClick={handleSubmit} loading={loading} className="h-12">
                                    Hoàn tất đăng ký
                                </Button>
                            </>
                        )}
                    </Form>

                    <Divider />
                    <div className="text-center">
                        <Text className="text-gray-500">Đã có tài khoản? </Text>
                        <Link to="/login" className="text-primary-600 font-medium">Đăng nhập</Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Register
