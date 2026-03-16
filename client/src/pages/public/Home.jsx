import { Link } from 'react-router-dom'
import { Button, Typography, Card, Row, Col, Space, Carousel, Image } from 'antd'
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
    LeftOutlined,
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


    const stats = [
        { number: '10,000+', label: 'Máy đã sửa chữa' },
        { number: '98%', label: 'Khách hài lòng' },
        { number: '5+', label: 'Năm kinh nghiệm' },
        { number: '24h', label: 'Thời gian xử lý TB' },
    ]

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section
                className="relative overflow-hidden"
                style={{
                    backgroundImage: `url('/images/hero-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Dark Overlay for text readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%)',
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-6 pb-20 md:pb-32 md:pt-10">
                    <Row gutter={[48, 48]} align="top">
                        <Col xs={24} lg={12}>
                            <div className="animate-fade-in-up" style={{ paddingTop: '72px' }}>
                                <Title className="!text-2xl md:!text-3xl lg:!text-4xl !leading-tight !text-white" style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px' }}>
                                    CHẨN ĐOÁN CHÍNH XÁC
                                    <br />
                                    <span style={{ color: '#fff' }}>CAN THIỆP CHUYÊN SÂU</span>
                                </Title>

                                <div
                                    className="inline-flex px-4 py-2 rounded-full text-sm font-medium text-white ml-24"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(4px)',
                                        marginBottom: '76px',
                                    }}
                                >
                                    Uy tín · Chất lượng · Chuyên nghiệp
                                </div>

                                <Space size="middle" wrap className="ml-4">
                                    <Link to="/book-appointment">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<CalendarOutlined />}
                                            className="h-12 px-8 text-base font-medium border-0 gradient-primary shadow-glow hover:scale-105 transition-transform"
                                        >
                                            Đặt lịch ngay
                                        </Button>
                                    </Link>
                                    <Link to="/status-lookup">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<SearchOutlined />}
                                            className="h-12 px-8 text-base font-medium border-0 gradient-primary shadow-glow hover:scale-105 transition-transform"
                                        >
                                            Tra cứu đơn hàng
                                        </Button>
                                    </Link>
                                </Space>
                            </div>
                        </Col>

                        <Col xs={24} lg={12}>
                            <div className="relative mt-8 md:mt-16">
                                {/* Decorative elements */}
                                <div className="absolute -top-8 -right-8 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-60" />
                                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent-100 rounded-full blur-3xl opacity-60" />

                                        <Carousel 
                                            autoplay 
                                            autoplaySpeed={2000} 
                                            speed={800} 
                                            effect="fade" 
                                            dotPosition="bottom" 
                                            arrows
                                            className="rounded-xl overflow-hidden shadow-2xl hero-carousel"
                                        >
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center relative">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80"
                                                        alt="Modern Laptop"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-6 left-6 text-white text-lg font-medium">Bảo trì dòng máy cao cấp</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center relative">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
                                                        alt="MacBook Pro"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-6 left-6 text-white text-lg font-medium">Sửa chữa MacBook chuyên sâu</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center relative">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80"
                                                        alt="Gaming Laptop"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-6 left-6 text-white text-lg font-medium">Nâng cấp dòng máy Gaming</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center relative">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"
                                                        alt="Business Laptop"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-6 left-6 text-white text-lg font-medium">Khắc phục lỗi Laptop văn phòng</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center relative">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80"
                                                        alt="Ultrabook"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-6 left-6 text-white text-lg font-medium">Chẩn đoán và thay thế linh kiện</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center relative">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80"
                                                        alt="Developer Laptop setup"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                                    <div className="absolute bottom-6 left-6 text-white text-lg font-medium">Khôi phục dữ liệu toàn vẹn</div>
                                                </div>
                                            </div>

                                            {/* Promotional Banner Slide 1 */}
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 relative group cursor-pointer">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
                                                        alt="Khuyến mãi sinh viên"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-900/40 p-8 flex flex-col justify-center">
                                                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-3 w-max uppercase tracking-wider">
                                                            Ưu đãi Hè 2026
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                                            Giảm 20% Phí Dịch Vụ
                                                        </h3>
                                                        <p className="text-primary-100 text-sm md:text-base mb-4 max-w-xs">
                                                            Dành riêng cho học sinh, sinh viên khi mang thẻ HSSV.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Promotional Banner Slide 2 */}
                                            <div>
                                                <div className="h-64 md:h-80 bg-gray-100 relative group cursor-pointer">
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80"
                                                        alt="Nâng cấp SSD miễn phí công"
                                                        preview={false}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-900/90 to-accent-900/40 p-8 flex flex-col justify-center">
                                                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-3 w-max uppercase tracking-wider">
                                                            Nâng cấp Siêu tốc
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                                            Miễn Phí Công Thay SSD
                                                        </h3>
                                                        <p className="text-accent-100 text-sm md:text-base mb-4 max-w-xs">
                                                            Nâng cấp ổ cứng SSD/RAM chính hãng. Tặng gói vệ sinh 250k.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </Carousel>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* Promotional Banners Section */}


        </div>
    )
}

export default Home
