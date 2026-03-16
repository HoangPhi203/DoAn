import { Typography, Row, Col, Card, Avatar, Rate } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const reviews = [
    { id: 1, name: 'Trần Văn Tùng', role: 'Sinh viên IT', rating: 5, date: '12/10/2026', content: 'Dịch vụ rất chu đáo. Laptop mình bị sập nguồn không rõ nguyên nhân, mang qua kỹ thuật viên tháo ra kiểm tra đo mạch trước mặt luôn, phát hiện lỗi IC nguồn thay trong 45 phút là lấy máy về.' },
    { id: 2, name: 'Nguyễn Thị Hoa', role: 'Nhân viên văn phòng', rating: 5, date: '05/09/2026', content: 'Mình ghé chi nhánh Thái Hà thay màn hình Full HD cho con Dell. Giá cả khá ổn áp, thái độ tiếp tân vui vẻ, màn hình được dán tem bảo hành đàng hoàng, độ sáng rất tốt, màu không bị nhợt.' },
    { id: 3, name: 'Lê Minh Nhật', role: 'Designer', rating: 4, date: '28/08/2026', content: 'Cửa hàng vệ sinh máy sạch sẽ, trét keo MX4 xịn sò. Nhiệt độ con Asus ROG của mình giảm đáng kể khi render video dạo này. Tuy nhiên có trừ 1 sao vì hôm đó đông khách phải đợi lấy máy hơi lâu.' },
    { id: 4, name: 'Phạm Đức Anh', role: 'Quản lý dự án', rating: 5, date: '10/08/2026', content: 'Giao diện đặt lịch website rất tiện. Mình book trước qua website nên đến cửa hàng báo Lễ tân là có KTV ra nhận máy hỗ trợ ngay không phải chờ đợi. Đánh giá cao trải nghiệm chuyển đổi số của trung tâm!' },
]

const Reviews = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <Title level={2} className="!mb-4">Khách hàng nói gì về chúng tôi?</Title>
                    <Paragraph className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Sự hài lòng của khách hàng là thước đo quan trọng nhất cho chất lượng dịch vụ sửa chữa của LaptopCare.
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {reviews.map(review => (
                        <Col xs={24} md={12} key={review.id}>
                            <Card className="rounded-2xl border-0 shadow-sm h-full relative" bodyStyle={{ padding: '32px' }}>
                                {/* Decorative Quotes */}
                                <div className="absolute top-8 right-8 text-8xl text-gray-100 font-serif leading-none" style={{ userSelect: 'none' }}>"</div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <Rate disabled defaultValue={review.rating} className="text-yellow-400 text-sm mb-6" />

                                    <Paragraph className="text-gray-600 text-base italic flex-1 leading-relaxed mb-8">
                                        "{review.content}"
                                    </Paragraph>

                                    <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                                        <Avatar size={48} icon={<UserOutlined />} className="bg-primary-100 text-primary-600 border border-primary-200" />
                                        <div>
                                            <Title level={5} className="!mb-0 !text-base">{review.name}</Title>
                                            <Text className="text-gray-400 text-sm">{review.role} • {review.date}</Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}

export default Reviews
