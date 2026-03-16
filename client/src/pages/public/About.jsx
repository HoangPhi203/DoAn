import { Typography, Row, Col, Card, Timeline, Avatar, Divider } from 'antd'
import { CheckCircleFilled, TrophyFilled, TeamOutlined, DesktopOutlined, SafetyCertificateFilled, ToolOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const features = [
    { title: 'Kinh nghiệm lâu năm', desc: 'Hơn 10 năm hoạt động trong lĩnh vực sửa chữa và phân phối linh kiện Laptop, Macbook.', icon: <TrophyFilled className="text-4xl text-primary-500" /> },
    { title: 'Kỹ thuật chuyên sâu', desc: 'Đội ngũ kỹ thuật viên được đào tạo bài bản, cập nhật công nghệ sửa chữa mới nhất liên tục.', icon: <TeamOutlined className="text-4xl text-primary-500" /> },
    { title: 'Linh kiện chính hãng', desc: 'Cam kết sử dụng linh kiện zin chất lượng cao, có nguồn gốc xuất xứ rõ ràng.', icon: <DesktopOutlined className="text-4xl text-primary-500" /> },
    { title: 'Bảo mật dữ liệu', desc: 'Tuyệt đối tôn trọng và bảo mật dữ liệu, quyền riêng tư của khách hàng.', icon: <SafetyCertificateFilled className="text-4xl text-primary-500" /> },
]

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-primary-900 py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <Title level={1} className="!text-white mb-6">Về LaptopCare</Title>
                    <Paragraph className="text-gray-300 text-lg">
                        Là hệ thống tiên phong trong lĩnh vực Dịch vụ IT, Viễn thông & sửa chữa thiết bị di động tại Việt Nam.
                        Chúng tôi được xây dựng và phát triển trên nền tảng của sự đam mê, tính chuyên nghiệp và trách nhiệm.
                    </Paragraph>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Introduction */}
                <Row gutter={[48, 48]} className="mb-20 items-center">
                    <Col xs={24} md={12}>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img
                                src="/images/about_hero_real.jpg"
                                alt="LaptopCare Internal Tech"
                                className="relative w-full rounded-2xl shadow-xl transition-transform hover:scale-[1.02]"
                            />
                            {/* Logo Overlay */}
                            <div className="absolute top-6 right-6 z-10 animate-fade-in">
                                <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-white/20 shadow-lg">
                                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                        <ToolOutlined className="text-white text-lg" />
                                    </div>
                                    <span className="font-semibold text-gray-800 tracking-tight">LaptopCare</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={2} className="!mb-6">Sứ Mệnh Của Chúng Tôi</Title>
                        <Paragraph className="text-gray-600 text-base leading-relaxed">
                            Trải qua quá trình hình thành và phát triển, LaptopCare đã từng bước khẳng định được vị thế của mình,
                            trở thành đơn vị vững mạnh trên bản đồ công nghệ Việt Nam.
                        </Paragraph>
                        <Paragraph className="text-gray-600 text-base leading-relaxed mb-6">
                            Sứ mệnh của chúng tôi không chỉ là "chữa bệnh" cho các thiết bị công nghệ mà còn là mang lại
                            sự an tâm, tiện ích và giá trị gia tăng tối đa cho khách hàng bằng chất lượng dịch vụ chuyên nghiệp nhất.
                        </Paragraph>

                        <div className="flex flex-col gap-3">
                            {['Tận tâm – Chuyên nghiệp', 'Lấy khách hàng làm trung tâm', 'Trung thực và trách nhiệm'].map((core, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircleFilled className="text-primary-500 text-xl" />
                                    <Text className="text-lg font-medium text-gray-800">{core}</Text>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Divider className="my-16" />

                {/* Why choose us */}
                <div className="text-center mb-12">
                    <Title level={2}>Tại Sao Chọn LaptopCare?</Title>
                    <Paragraph className="text-gray-500 text-lg">Những giá trị cốt lõi làm nên sự khác biệt của chúng tôi</Paragraph>
                </div>

                <Row gutter={[24, 24]} className="mb-20">
                    {features.map((feature, idx) => (
                        <Col xs={24} sm={12} lg={6} key={idx}>
                            <Card className="h-full text-center hover:shadow-lg transition-all border-none bg-gray-50 rounded-2xl p-4">
                                <div className="mb-6 inline-flex p-4 rounded-2xl bg-white shadow-sm">{feature.icon}</div>
                                <Title level={4} className="!mb-3">{feature.title}</Title>
                                <Paragraph className="text-gray-500 m-0 leading-relaxed">{feature.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Image Gallery */}
                <Divider className="my-16" />
                <div className="mb-12">
                    <Title level={2} className="text-center mb-12">Hình Ảnh Hoạt Động</Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card className="border-none p-0 overflow-hidden rounded-2xl shadow-md group">
                                <img 
                                    src="/images/about_repair.png" 
                                    alt="Technical Repair" 
                                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-bottom p-8">
                                    <div>
                                        <Title level={4} className="!text-white !mb-2">Kỹ Thuật Chuyên Nghiệp</Title>
                                        <Text className="text-gray-200">Sửa chữa với máy móc hiện đại và kỹ thuật tay nghề cao</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card className="border-none p-0 overflow-hidden rounded-2xl shadow-md group">
                                <img 
                                    src="/images/about_parts.png" 
                                    alt="Genuine Parts" 
                                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-bottom p-8">
                                    <div>
                                        <Title level={4} className="!text-white !mb-2">Linh Kiện Chính Hãng</Title>
                                        <Text className="text-gray-200">Nguồn linh kiện dồi dào, đảm bảo chất lượng linh kiện thay thế</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default About
