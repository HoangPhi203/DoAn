import { Card, Form, Input, Select, Button, Typography, Row, Col, Divider, message } from 'antd'
import { UserOutlined, PhoneOutlined, LaptopOutlined, SaveOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const OrderIntake = () => {
    const [form] = Form.useForm()

    const deviceBrands = ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Samsung', 'Khác']

    const handleSubmit = (values) => {
        console.log('Order data:', values)
        message.success('Đã tạo đơn tiếp nhận thành công!')
        form.resetFields()
    }

    return (
        <div className="max-w-4xl">
            <Title level={4} className="!mb-6">Tiếp nhận đơn sửa chữa mới</Title>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Form form={form} layout="vertical" size="large" onFinish={handleSubmit}>
                    <div className="mb-6">
                        <Text strong className="text-lg flex items-center gap-2">
                            <UserOutlined className="text-blue-500" /> Thông tin khách hàng
                        </Text>
                    </div>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item name="customerName" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }]}>
                                <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0901234567" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <div className="mb-6">
                        <Text strong className="text-lg flex items-center gap-2">
                            <LaptopOutlined className="text-blue-500" /> Thông tin thiết bị
                        </Text>
                    </div>

                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item name="deviceBrand" label="Hãng laptop" rules={[{ required: true, message: 'Chọn hãng' }]}>
                                <Select placeholder="Chọn hãng">
                                    {deviceBrands.map(brand => <Option key={brand} value={brand}>{brand}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="deviceModel" label="Model" rules={[{ required: true, message: 'Nhập model' }]}>
                                <Input placeholder="XPS 15 9520" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="deviceSerial" label="Serial/IMEI">
                                <Input placeholder="ABC123XYZ" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="issueDescription" label="Mô tả lỗi" rules={[{ required: true, message: 'Mô tả lỗi' }]}>
                        <TextArea rows={4} placeholder="Mô tả chi tiết tình trạng lỗi của thiết bị..." />
                    </Form.Item>

                    <Form.Item name="accessories" label="Phụ kiện kèm theo">
                        <Input placeholder="Sạc, túi đựng..." />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => form.resetFields()}>Xóa form</Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Tạo đơn tiếp nhận</Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default OrderIntake
