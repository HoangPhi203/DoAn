import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, DatePicker, Select, Typography, Result, Row, Col, Divider, message } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, LaptopOutlined, UserOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { timeSlots } from '../../data/mockAppointments'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const BookAppointment = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [bookingComplete, setBookingComplete] = useState(false)
    const [bookingData, setBookingData] = useState(null)
    const navigate = useNavigate()

    const deviceTypes = ['Dell XPS', 'Dell Inspiron', 'Dell Latitude', 'MacBook Pro', 'MacBook Air', 'Asus ROG', 'Asus Vivobook', 'Asus Zenbook', 'Lenovo ThinkPad', 'Lenovo Legion', 'Lenovo IdeaPad', 'HP Pavilion', 'HP Probook', 'HP Envy', 'Acer Nitro', 'Acer Aspire', 'MSI Gaming', 'Khác']

    const disabledDate = (current) => current && (current < dayjs().startOf('day') || current > dayjs().add(30, 'day'))

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)

            // Build the date+time into a proper ISO date
            const dateStr = values.date.format('YYYY-MM-DD')
            const ngayGioHen = new Date(`${dateStr}T${values.time}:00`)

            const response = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hoTenKhach: values.name,
                    soDienThoai: values.phone,
                    ngayGioHen: ngayGioHen.toISOString(),
                    noiDungHongHoc: values.issueDescription,
                    modelMay: values.deviceType,
                    ghiChu: values.email || ''
                })
            })

            const data = await response.json()

            if (data.success) {
                setBookingData({
                    ...values,
                    id: data.data._id,
                    date: values.date.format('DD/MM/YYYY')
                })
                setBookingComplete(true)
                message.success('Đặt lịch thành công! Dữ liệu đã được lưu.')
            } else {
                message.error(data.message || 'Có lỗi xảy ra khi đặt lịch')
            }
        } catch (error) {
            console.error(error)
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc')
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
                                <Button type="primary" key="home" onClick={() => navigate('/')} className="gradient-primary">Về trang chủ</Button>,
                                <Button key="lookup" onClick={() => navigate('/status-lookup')} className="hover:text-primary-600 border-primary-600 text-primary-600">Tra cứu đơn hàng</Button>,
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
                    <Text className="text-lg text-gray-500">Điền thông tin bên dưới để đặt lịch ngay</Text>
                </div>

                <Card className="shadow-lg border-0" style={{ borderRadius: 16 }}>
                    <Form form={form} layout="vertical" size="large" className="p-2 md:p-4">
                        {/* Thông tin liên hệ */}
                        <div className="mb-6">
                            <Title level={4} className="!mb-6 flex items-center gap-2">
                                <UserOutlined className="text-primary-600" />
                                Thông tin liên hệ
                            </Title>
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

                        <Divider />

                        {/* Thông tin lịch hẹn */}
                        <div className="mb-6">
                            <Title level={4} className="!mb-6 flex items-center gap-2">
                                <CalendarOutlined className="text-primary-600" />
                                Thông tin lịch hẹn
                            </Title>
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

                        {/* Lưu ý */}
                        <div className="p-4 bg-blue-50 rounded-xl mb-6">
                            <div className="flex items-start gap-3">
                                <CheckCircleOutlined className="text-blue-600 text-lg mt-0.5" />
                                <div>
                                    <Text strong>Lưu ý:</Text>
                                    <Paragraph className="!mb-0 text-sm text-gray-600">
                                        Sau khi đặt lịch, nhân viên sẽ liên hệ xác nhận qua số điện thoại bạn đã cung cấp trong vòng 30 phút (trong giờ làm việc).
                                    </Paragraph>
                                </div>
                            </div>
                        </div>

                        {/* Nút đặt lịch */}
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            loading={loading}
                            icon={<CheckCircleOutlined />}
                            block
                            className="h-12 text-lg font-semibold gradient-primary border-0"
                        >
                            Đặt lịch ngay
                        </Button>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default BookAppointment
