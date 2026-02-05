import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, DatePicker, Select, Typography, Steps, Result, Row, Col, Divider, message } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, LaptopOutlined, UserOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { timeSlots } from '../../data/mockAppointments'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const BookAppointment = () => {
    const [form] = Form.useForm()
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [bookingComplete, setBookingComplete] = useState(false)
    const [bookingData, setBookingData] = useState(null)
    const navigate = useNavigate()

    const deviceTypes = ['Dell XPS', 'Dell Inspiron', 'Dell Latitude', 'MacBook Pro', 'MacBook Air', 'Asus ROG', 'Asus Vivobook', 'Asus Zenbook', 'Lenovo ThinkPad', 'Lenovo Legion', 'Lenovo IdeaPad', 'HP Pavilion', 'HP Probook', 'HP Envy', 'Acer Nitro', 'Acer Aspire', 'MSI Gaming', 'Khác']

    const steps = [
        { title: 'Thông tin', icon: <UserOutlined /> },
        { title: 'Lịch hẹn', icon: <CalendarOutlined /> },
        { title: 'Xác nhận', icon: <CheckCircleOutlined /> },
    ]

    const disabledDate = (current) => current && (current < dayjs().startOf('day') || current > dayjs().add(30, 'day'))

    const handleNext = async () => {
        try {
            if (currentStep === 0) await form.validateFields(['name', 'phone', 'email'])
            else if (currentStep === 1) await form.validateFields(['date', 'time', 'deviceType', 'issueDescription'])
            setCurrentStep(currentStep + 1)
        } catch (error) { }
    }

    const handlePrev = () => setCurrentStep(currentStep - 1)

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 1500))
            const appointmentId = `APT-${Date.now().toString().slice(-6)}`
            setBookingData({ ...values, id: appointmentId, date: values.date.format('DD/MM/YYYY') })
            setBookingComplete(true)
            message.success('Đặt lịch thành công!')
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại')
        } finally {
            setLoading(false)
        }
    }

    if (bookingComplete && bookingData) {
        return (
            <div className="min-h-[80vh] py-12 md:py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <Card className="shadow-lg border-0" style={{ borderRadius: 16 }}>
                        <Result status="success" title="Đặt lịch thành công!"
                            subTitle={
                                <div className="text-left max-w-sm mx-auto mt-4">
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between"><Text className="text-gray-500">Mã lịch hẹn:</Text><Text strong className="text-primary-600">{bookingData.id}</Text></div>
                                        <div className="flex justify-between"><Text className="text-gray-500">Ngày hẹn:</Text><Text strong>{bookingData.date}</Text></div>
                                        <div className="flex justify-between"><Text className="text-gray-500">Giờ hẹn:</Text><Text strong>{bookingData.time}</Text></div>
                                        <div className="flex justify-between"><Text className="text-gray-500">Thiết bị:</Text><Text strong>{bookingData.deviceType}</Text></div>
                                    </div>
                                    <Paragraph className="text-center mt-4 text-gray-500">Chúng tôi sẽ liên hệ xác nhận qua số điện thoại <strong>{bookingData.phone}</strong></Paragraph>
                                </div>
                            }
                            extra={[
                                <Button type="primary" key="home" onClick={() => navigate('/')}>Về trang chủ</Button>,
                                <Button key="lookup" onClick={() => navigate('/status-lookup')}>Tra cứu đơn hàng</Button>,
                            ]}
                        />
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] py-12 md:py-16">
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                        <CalendarOutlined className="text-3xl text-white" />
                    </div>
                    <Title level={2} className="!mb-2">Đặt lịch hẹn sửa chữa</Title>
                    <Text className="text-lg text-gray-500">Đặt lịch trước để được phục vụ nhanh chóng hơn</Text>
                </div>

                <div className="mb-8">
                    <Steps current={currentStep} items={steps} className="max-w-md mx-auto" />
                </div>

                <Card className="shadow-lg border-0" style={{ borderRadius: 16 }}>
                    <Form form={form} layout="vertical" size="large" className="p-2 md:p-4">
                        {currentStep === 0 && (
                            <div className="animate-fade-in">
                                <Title level={4} className="!mb-6">Thông tin liên hệ</Title>
                                <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                                    <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ' }]}>
                                            <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0901234567" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                                            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="email@example.com" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="animate-fade-in">
                                <Title level={4} className="!mb-6">Thông tin lịch hẹn</Title>
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                                            <DatePicker className="w-full" format="DD/MM/YYYY" disabledDate={disabledDate} placeholder="Chọn ngày" suffixIcon={<CalendarOutlined />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
                                            <Select placeholder="Chọn giờ" suffixIcon={<ClockCircleOutlined />}>
                                                {timeSlots.map(slot => <Option key={slot} value={slot}>{slot}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item name="deviceType" label="Loại thiết bị" rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị' }]}>
                                    <Select placeholder="Chọn loại laptop" showSearch optionFilterProp="children" suffixIcon={<LaptopOutlined />}>
                                        {deviceTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="issueDescription" label="Mô tả lỗi/vấn đề" rules={[{ required: true, message: 'Vui lòng mô tả lỗi thiết bị' }]}>
                                    <TextArea rows={4} placeholder="Mô tả chi tiết tình trạng lỗi của thiết bị..." />
                                </Form.Item>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="animate-fade-in">
                                <Title level={4} className="!mb-6">Xác nhận thông tin</Title>
                                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><Text className="text-gray-500 text-sm">Họ và tên</Text><div className="font-medium">{form.getFieldValue('name')}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Số điện thoại</Text><div className="font-medium">{form.getFieldValue('phone')}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Email</Text><div className="font-medium">{form.getFieldValue('email') || 'Không có'}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Thiết bị</Text><div className="font-medium">{form.getFieldValue('deviceType')}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Ngày hẹn</Text><div className="font-medium text-primary-600">{form.getFieldValue('date')?.format('DD/MM/YYYY')}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Giờ hẹn</Text><div className="font-medium text-primary-600">{form.getFieldValue('time')}</div></div>
                                    </div>
                                    <Divider className="!my-4" />
                                    <div><Text className="text-gray-500 text-sm">Mô tả lỗi</Text><div className="mt-1 p-3 bg-white rounded-lg">{form.getFieldValue('issueDescription')}</div></div>
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <CheckCircleOutlined className="text-blue-600 text-lg mt-0.5" />
                                        <div><Text strong>Lưu ý:</Text><Paragraph className="!mb-0 text-sm text-gray-600">Sau khi đặt lịch, nhân viên sẽ liên hệ xác nhận qua số điện thoại bạn đã cung cấp trong vòng 30 phút (trong giờ làm việc).</Paragraph></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Divider />
                        <div className="flex justify-between">
                            {currentStep > 0 && <Button size="large" onClick={handlePrev}>Quay lại</Button>}
                            <div className="ml-auto">
                                {currentStep < 2 && <Button type="primary" size="large" onClick={handleNext}>Tiếp tục</Button>}
                                {currentStep === 2 && <Button type="primary" size="large" onClick={handleSubmit} loading={loading} icon={<CheckCircleOutlined />}>Xác nhận đặt lịch</Button>}
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default BookAppointment
