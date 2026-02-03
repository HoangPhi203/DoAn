import { Link } from 'react-router-dom'
import { Button, Typography, Card, Row, Col, Space } from 'antd'
import {
    SearchOutlined,
    CalendarOutlined,
    ToolOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    RightOutlined,
    LaptopOutlined,
    CustomerServiceOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const Home = () => {
    const features = [
        {
            icon: <ThunderboltOutlined className="text-3xl text-primary-600" />,
            title: 'Sửa chữa nhanh chóng',
            description: 'Đội ngũ kỹ thuật viên xử lý nhanh, đảm bảo tiến độ cam kết',
        },
        {
            icon: <SafetyOutlined className="text-3xl text-green-600" />,
            title: 'Bảo hành uy tín',
            description: 'Bảo hành từ 3-12 tháng cho tất cả dịch vụ sửa chữa',
        },
        {
            icon: <DollarOutlined className="text-3xl text-amber-600" />,
            title: 'Giá cả minh bạch',
            description: 'Báo giá trước khi sửa, không phát sinh chi phí ẩn',
        },
    ]

    const services = [
        { name: 'Thay màn hình laptop', price: 'Từ 1.500.000đ' },
        { name: 'Thay pin laptop', price: 'Từ 800.000đ' },
        { name: 'Sửa bàn phím laptop', price: 'Từ 300.000đ' },
        { name: 'Vệ sinh, bảo dưỡng', price: 'Từ 200.000đ' },
        { name: 'Nâng cấp RAM, SSD', price: 'Từ 500.000đ' },
        { name: 'Sửa lỗi phần mềm', price: 'Từ 150.000đ' },
    ]

    const stats = [
        { number: '10,000+', label: 'Máy đã sửa chữa' },
        { number: '98%', label: 'Khách hài lòng' },
        { number: '5+', label: 'Năm kinh nghiệm' },
        { number: '24h', label: 'Thời gian xử lý TB' },
    ]

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Gradient */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        background: 'radial-gradient(circle at 30% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 70% 80%, #d946ef 0%, transparent 50%)',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <div className="animate-fade-in-up">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
                                    <CheckCircleOutlined />
                                    <span>Uy tín - Chất lượng - Chuyên nghiệp</span>
                                </div>

                                <Title className="!text-4xl md:!text-5xl lg:!text-6xl !mb-6 !leading-tight">
                                    Sửa chữa Laptop{' '}
                                    <span className="gradient-text">Chuyên nghiệp</span>
                                </Title>

                                <Paragraph className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                                    Dịch vụ sửa chữa laptop hàng đầu với đội ngũ kỹ thuật viên
                                    giàu kinh nghiệm. Cam kết sửa đúng lỗi, giá hợp lý.
                                </Paragraph>

                                <Space size="middle" wrap>
                                    <Link to="/book-appointment">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<CalendarOutlined />}
                                            className="h-12 px-8 text-base font-medium"
                                        >
                                            Đặt lịch ngay
                                        </Button>
                                    </Link>
                                    <Link to="/status-lookup">
                                        <Button
                                            size="large"
                                            icon={<SearchOutlined />}
                                            className="h-12 px-8 text-base font-medium"
                                        >
                                            Tra cứu đơn hàng
                                        </Button>
                                    </Link>
                                </Space>
                            </div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <div className="relative">
                                {/* Decorative elements */}
                                <div className="absolute -top-8 -right-8 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-60" />
                                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent-100 rounded-full blur-3xl opacity-60" />

                                {/* Hero Card */}
                                <Card
                                    className="relative shadow-2xl border-0 overflow-hidden"
                                    style={{ borderRadius: 24 }}
                                >
                                    <div className="p-4 md:p-8">
                                        <div className="flex items-center justify-center mb-6">
                                            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                                                <LaptopOutlined className="text-4xl text-white" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {stats.map((stat, index) => (
                                                <div
                                                    key={index}
                                                    className="text-center p-4 bg-gray-50 rounded-xl"
                                                >
                                                    <div className="text-2xl md:text-3xl font-bold gradient-text">
                                                        {stat.number}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <Title level={2} className="!mb-4">
                            Tại sao chọn <span className="gradient-text">LaptopCare</span>?
                        </Title>
                        <Text className="text-lg text-gray-500">
                            Chúng tôi cam kết mang đến dịch vụ tốt nhất cho bạn
                        </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {features.map((feature, index) => (
                            <Col xs={24} md={8} key={index}>
                                <Card
                                    className="h-full text-center card-hover border-0 shadow-soft"
                                    style={{ borderRadius: 16 }}
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <Title level={4} className="!mb-2">{feature.title}</Title>
                                    <Text className="text-gray-500">{feature.description}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <div className="mb-8 lg:mb-0">
                                <Title level={2} className="!mb-4">
                                    Dịch vụ <span className="gradient-text">sửa chữa</span>
                                </Title>
                                <Paragraph className="text-lg text-gray-500 mb-6">
                                    Chúng tôi cung cấp đầy đủ các dịch vụ sửa chữa và nâng cấp
                                    laptop với chất lượng tốt nhất.
                                </Paragraph>

                                <div className="space-y-3">
                                    {services.map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircleOutlined className="text-green-500" />
                                                <span className="font-medium">{service.name}</span>
                                            </div>
                                            <span className="text-primary-600 font-semibold">{service.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card
                                className="border-0 shadow-soft overflow-hidden"
                                style={{ borderRadius: 20, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
                            >
                                <div className="p-6 md:p-8 text-white">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                            <CustomerServiceOutlined className="text-2xl" />
                                        </div>
                                        <div>
                                            <Title level={4} className="!text-white !mb-0">Hotline hỗ trợ</Title>
                                            <Text className="text-white/80">Miễn phí 24/7</Text>
                                        </div>
                                    </div>

                                    <Title level={2} className="!text-white !mb-6">1900 1234 56</Title>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-white/90">
                                            <ClockCircleOutlined />
                                            <span>Thứ 2 - Thứ 7: 8:00 - 20:00</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/90">
                                            <ClockCircleOutlined />
                                            <span>Chủ nhật: 9:00 - 17:00</span>
                                        </div>
                                    </div>

                                    <Link to="/book-appointment">
                                        <Button
                                            size="large"
                                            className="w-full h-12 bg-white text-primary-600 border-0 font-medium hover:bg-gray-100"
                                            icon={<RightOutlined />}
                                        >
                                            Đặt lịch tư vấn miễn phí
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <Title level={2} className="!text-white !mb-4">
                        Laptop của bạn đang gặp vấn đề?
                    </Title>
                    <Paragraph className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                        Đừng lo lắng! Đội ngũ kỹ thuật viên của chúng tôi sẵn sàng hỗ trợ bạn.
                        Đặt lịch ngay hoặc mang máy đến cửa hàng để được tư vấn miễn phí.
                    </Paragraph>

                    <Space size="middle" wrap className="justify-center">
                        <Link to="/book-appointment">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CalendarOutlined />}
                                className="h-12 px-8"
                            >
                                Đặt lịch hẹn
                            </Button>
                        </Link>
                        <Link to="/status-lookup">
                            <Button
                                size="large"
                                icon={<SearchOutlined />}
                                className="h-12 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                Tra cứu đơn hàng
                            </Button>
                        </Link>
                    </Space>
                </div>
            </section>
        </div>
    )
}

export default Home
