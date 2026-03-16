import { useState } from 'react'
import { Typography, Row, Col, Card, Form, Input, Button, message } from 'antd'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const Contact = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const onFinish = (values) => {
        setLoading(true)
        // Mock API call to send message
        setTimeout(() => {
            message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.')
            form.resetFields()
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <Title level={2} className="!mb-4">Liên Hệ Với LaptopCare</Title>
                    <Paragraph className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại lời nhắn hoặc liên hệ trực tiếp qua số Hotline bên dưới.
                    </Paragraph>
                </div>

                <Row gutter={[48, 48]}>
                    <Col xs={24} lg={10}>
                        {/* Contact Info */}
                        <div className="mb-12">
                            <Title level={3} className="!mb-8">Thông Tin Liên Hệ</Title>

                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <PhoneOutlined className="text-primary-600 text-xl" />
                                </div>
                                <div>
                                    <Title level={5} className="!mb-1">Hotline & Kỹ thuật</Title>
                                    <Text className="text-gray-600 text-base">Tổng đài: 0383 634 255</Text>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <EnvironmentOutlined className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <Title level={5} className="!mb-1">Địa Chỉ Hệ Thống</Title>
                                    <Text className="text-gray-600 text-base">🏠 Số nhà 35 ngõ 451 đường Hoàng Tăng Bí, Thành phố Hà Nội</Text>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={14}>
                        {/* Contact Form */}
                        <Card className="shadow-xl border-0 rounded-2xl bg-gray-50/50">
                            <Title level={4} className="!mb-6 text-center">Gửi tin nhắn ngay</Title>
                            <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item name="name" label="Họ tên của bạn" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                            <Input placeholder="Nguyễn Văn A" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
                                            <Input placeholder="090 123 4567" prefix={<PhoneOutlined className="text-gray-400" />} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item name="email" label="Địa chỉ Email (Không bắt buộc)">
                                    <Input placeholder="email@domain.com" prefix={<MailOutlined className="text-gray-400" />} />
                                </Form.Item>
                                <Form.Item name="subject" label="Chủ đề / Yêu cầu" rules={[{ required: true, message: 'Vui lòng nhập chủ đề' }]}>
                                    <Input placeholder="VD: Hỏi giá màn hình laptop Dell..." />
                                </Form.Item>
                                <Form.Item name="message" label="Nội dung cần hỗ trợ" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                                    <TextArea placeholder="Chi tiết lỗi của máy tính hoặc yêu cầu của bạn..." rows={4} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full h-12 text-base rounded-xl mt-4 gradient-primary border-0" loading={loading} icon={<SendOutlined />}>
                                    Gửi Yêu Cầu
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[400px] mt-20 bg-gray-200 relative flex items-center justify-center border-t border-b border-gray-300">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.757674388681!2d105.76923257449785!3d21.08233858593769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345537bd56b507%3A0xb002f62f6cdf066!2zMzUgTmcuIDQ1MSBIb8OgbmcgVMSDbmcgQsOtLCBUaHXhu7UgUGjGsMahbmcsIELhuq9jIFThu6sgTGnDqm0sIEjDoCBO4buZaSwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1773324914965!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps LaptopCare"
                    className="absolute inset-0"
                />
            </div>
        </div>
    )
}

export default Contact
