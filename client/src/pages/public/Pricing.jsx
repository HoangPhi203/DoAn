import { Typography, Row, Col, Card, Tabs, Table, Avatar, Tag } from 'antd'
import { DollarOutlined, CodeOutlined, DesktopOutlined, ToolOutlined, PlusOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const pricingData = {
    cleaning: [
        { key: '1', item: 'Vệ sinh Laptop tiêu chuẩn (Keo tản nhiệt MX4)', price: '150.000đ', time: '30 - 45 Phút', warranty: 'N/A' },
        { key: '2', item: 'Vệ sinh Laptop Gaming, Workstation', price: '250.000đ', time: '45 - 60 Phút', warranty: 'N/A' },
        { key: '3', item: 'Vệ sinh Macbook Pro / Air', price: '200.000đ', time: '45 - 60 Phút', warranty: 'N/A' },
        { key: '4', item: 'Vệ sinh PC, máy tính bộ', price: '200.000đ', time: '60 Phút', warranty: 'N/A' },
    ],
    software: [
        { key: '1', item: 'Cài Windows 10/11 & Full Soft cơ bản', price: '150.000đ', time: '45 - 60 Phút', warranty: 'Hỗ trợ online trọn đời' },
        { key: '2', item: 'Cài đặt MacOS cho Macbook', price: '200.000đ', time: '60 Phút', warranty: 'Hỗ trợ online trọn đời' },
        { key: '3', item: 'Cài song song Mac & Win', price: '250.000đ', time: '90 Phút', warranty: 'Hỗ trợ online trọn đời' },
        { key: '4', item: 'Cài phần mềm đồ họa (Adobe, AutoCad, SolidWorks)', price: '50.000đ - 100.000đ/phần mềm', time: '15 - 30 Phút', warranty: 'N/A' },
    ],
    parts: [
        { key: '1', item: 'Bàn phím Laptop Dell/HP/Asus phổ thông', price: 'Từ 250.000đ', time: 'Lấy ngay', warranty: '12 Tháng (1 đổi 1)' },
        { key: '2', item: 'Bàn phím MacBook', price: 'Từ 850.000đ', time: '1 - 2 Giờ', warranty: '6 - 12 Tháng' },
        { key: '3', item: 'Ổ cứng SSD 256GB / 512GB (SATA/NVMe)', price: 'Liên hệ', time: '15 Phút', warranty: '36 Tháng' },
        { key: '4', item: 'RAM 8GB / 16GB / 32GB (DDR4/DDR5)', price: 'Liên hệ', time: '5 Phút', warranty: '36 Tháng' },
        { key: '5', item: 'Màn hình Laptop 14"/15.6" (HD/FHD)', price: 'Từ 1.200.000đ', time: '15 - 30 Phút', warranty: '12 Tháng' },
        { key: '6', item: 'Pin Laptop các hãng thay thế', price: 'Từ 450.000đ', time: 'Lấy ngay', warranty: '6 - 12 Tháng' },
    ]
}

const columns = [
    {
        title: 'Hạng mục',
        dataIndex: 'item',
        key: 'item',
        render: text => <span className="font-medium text-gray-800">{text}</span>
    },
    {
        title: 'Giá tiền',
        dataIndex: 'price',
        key: 'price',
        render: price => <span className="text-primary-600 font-semibold">{price}</span>,
        width: 150
    },
    {
        title: 'Thời gian xử lý',
        dataIndex: 'time',
        key: 'time',
        width: 150
    },
    {
        title: 'Bảo hành',
        dataIndex: 'warranty',
        key: 'warranty',
        render: text => <Tag color={text.includes('12') || text.includes('36') ? 'green' : 'blue'}>{text}</Tag>,
        width: 120
    }
]

const tabItems = [
    {
        key: '1',
        label: (
            <span className="flex items-center gap-2">
                <ToolOutlined /> Vệ sinh máy
            </span>
        ),
        children: <Table columns={columns} dataSource={pricingData.cleaning} pagination={false} bordered className="rounded-xl overflow-hidden" />
    },
    {
        key: '2',
        label: (
            <span className="flex items-center gap-2">
                <CodeOutlined /> Cài đặt phần mềm
            </span>
        ),
        children: <Table columns={columns} dataSource={pricingData.software} pagination={false} bordered className="rounded-xl overflow-hidden" />
    },
    {
        key: '3',
        label: (
            <span className="flex items-center gap-2">
                <DesktopOutlined /> Thay thế linh kiện
            </span>
        ),
        children: (
            <div>
                <Table columns={columns} dataSource={pricingData.parts} pagination={false} bordered className="rounded-xl overflow-hidden" />
                <div className="mt-4 text-gray-500 text-sm italic">
                    * Báo giá linh kiện (Ổ cứng, RAM, Màn hình, Pin...) có thể thay đổi tùy thuộc vào thời điểm, mã máy (model) và trạng thái tồn kho thực tế. Vui lòng liên hệ trực tiếp để có báo giá chuẩn xác nhất.
                </div>
            </div>
        )
    }
]

const Pricing = () => {
    const location = useLocation()
    const pathName = location.pathname.split('/').filter(Boolean).pop()

    // Map URL endpoints to Tab Keys
    let activeKey = '1'
    if (pathName === 'parts') activeKey = '3'
    else if (pathName === 'software') activeKey = '2'

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <Title level={2} className="!mb-4">Bảng Giá Dịch Vụ</Title>
                    <Paragraph className="text-gray-500 text-lg">
                        LaptopCare cam kết cung cấp dịch vụ chất lượng với mức giá cạnh tranh, minh bạch. Tất cả các dịch vụ đều được báo giá trước khi thực hiện.
                    </Paragraph>
                </div>

                <Card className="shadow-lg border-0 rounded-2xl mb-12">
                    <Tabs defaultActiveKey={activeKey} items={tabItems} size="large" centered />
                </Card>

                {/* Info Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-full border border-gray-100 flex items-start gap-4">
                            <Avatar size={48} className="bg-green-100 flex-shrink-0" icon={<DollarOutlined className="text-green-600" />} />
                            <div>
                                <Title level={5} className="!mb-2">Kiểm tra miễn phí 100%</Title>
                                <Paragraph className="text-gray-500 m-0">
                                    Dù khách hàng có đồng ý sửa hay không sau khi biết lỗi và chi phí,LaptopCare cam kết hoàn toàn không thu phí kiểm tra máy.
                                </Paragraph>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-full border border-gray-100 flex items-start gap-4">
                            <Avatar size={48} className="bg-blue-100 flex-shrink-0" icon={<PlusOutlined className="text-blue-600" />} />
                            <div>
                                <Title level={5} className="!mb-2">Chính sách bảo hành rõ ràng</Title>
                                <Paragraph className="text-gray-500 m-0">
                                    Bảo hành linh kiện dài hạn từ 6 - 36 tháng. Chính sách 1 đổi 1 ngay lập tức đối với linh kiện gặp lỗi từ nhà sản xuất.
                                </Paragraph>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Pricing
