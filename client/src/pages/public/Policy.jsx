import { Typography, Breadcrumb, Menu, Layout, Card } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { SafetyCertificateOutlined, RetweetOutlined, CreditCardOutlined, CarOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Sider, Content } = Layout

const policyContent = {
    'warranty': {
        title: 'Chính sách bảo hành',
        content: (
            <div className="space-y-4">
                <Paragraph className="text-base text-gray-600">
                    LaptopCare cam kết mang đến dịch vụ bảo hành tốt nhất cho Quý khách hàng. Tất cả các sản phẩm và dịch vụ sửa chữa đều tuân theo quy định bảo hành tiêu chuẩn của hãng hoặc của riêng LaptopCare.
                </Paragraph>
                <Title level={4}>1. Điều kiện bảo hành miễn phí</Title>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Sản phẩm còn thời hạn bảo hành tính từ ngày mua/sửa chữa ghi trên phiếu hóa đơn.</li>
                    <li>Tem bảo hành phải còn nguyên vẹn, không có dấu hiệu cạo sửa, rách, mờ.</li>
                    <li>Sản phẩm bị lỗi kỹ thuật do quá trình sửa chữa của kỹ thuật viên hoặc do lỗi của bản thân linh kiện (nhà sản xuất).</li>
                </ul>
                <Title level={4}>2. Các trường hợp từ chối bảo hành</Title>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Máy bị vô nước, rớt vỡ, móp méo, chập cháy do nguồn điện không ổn định.</li>
                    <li>Lỗi phần mềm, Windows, Virus sau khi đã bàn giao máy chạy ổn định (trừ trường hợp mua gói bảo hành phần mềm).</li>
                    <li>Tự ý tháo lắp, sửa chữa tại các cơ sở khác không thuộc hệ thống LaptopCare.</li>
                </ul>
            </div>
        )
    },
    'return': {
        title: 'Chính sách đổi trả',
        content: (
            <div className="space-y-4">
                <Paragraph className="text-base text-gray-600">
                    Chính sách đổi trả linh kiện 1 đổi 1 áp dụng cho mọi linh kiện được thay thế mới tại trung tâm.
                    LaptopCare hỗ trợ khách hàng đổi trả miễn phí trong vòng <Text strong>7 ngày</Text> đầu nếu không ưng ý (đối với linh kiện chưa qua sử dụng).
                </Paragraph>
            </div>
        )
    },
    'privacy': {
        title: 'Chính sách bảo mật',
        content: (
            <div className="space-y-4">
                <Paragraph className="text-base text-gray-600">
                    Dữ liệu cá nhân của Quý khách hàng là tài sản vô giá. Kỹ thuật viên của chúng tôi cam kết tuyệt đối không sao chép, đánh cắp hay truy cập trái phép vào tập tin cá nhân trong quá trình sửa chữa thiết bị.
                </Paragraph>
            </div>
        )
    }
}

const Policy = () => {
    const location = useLocation()
    const pathName = location.pathname.split('/').pop()
    const currentPolicyId = Object.keys(policyContent).includes(pathName) ? pathName : 'warranty'
    const currentData = policyContent[currentPolicyId]

    const menuItems = [
        { key: 'warranty', icon: <SafetyCertificateOutlined />, label: <Link to="/policy/warranty">Chính sách bảo hành</Link> },
        { key: 'return', icon: <RetweetOutlined />, label: <Link to="/policy/return">Chính sách đổi trả</Link> },
        { key: 'privacy', icon: <CreditCardOutlined />, label: <Link to="/policy/privacy">Chính sách bảo mật</Link> },
        { key: 'shipping', icon: <CarOutlined />, label: <Link to="/policy/shipping">Chính sách vận chuyển</Link> },
    ]

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Trang chủ</Link> },
                            { title: 'Chính sách' },
                            { title: currentData?.title },
                        ]}
                        className="text-base"
                    />
                </div>

                <Layout className="bg-transparent gap-8" hasSider>
                    <Sider width={280} className="bg-transparent hidden md:block">
                        <Card className="rounded-2xl border-0 shadow-sm sticky top-24 overflow-hidden" bodyStyle={{ padding: 0 }}>
                            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                                <Title level={5} className="!mb-0 uppercase tracking-wide text-gray-600 font-bold">Quy định - Chính sách</Title>
                            </div>
                            <Menu
                                mode="inline"
                                selectedKeys={[currentPolicyId]}
                                items={menuItems}
                                className="border-none py-2 font-medium"
                            />
                        </Card>
                    </Sider>
                    <Content>
                        <Card className="rounded-2xl border-0 shadow-sm min-h-[500px] p-2 md:p-8">
                            <Title level={2} className="!mb-8 text-primary-600 border-b border-gray-100 pb-4">{currentData?.title}</Title>
                            {currentData?.content || <Paragraph>Nội dung đang được cập nhật...</Paragraph>}
                        </Card>
                    </Content>
                </Layout>
            </div>
        </div>
    )
}

export default Policy
