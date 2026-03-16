import { Typography, Row, Col, Card, Tooltip, Button } from 'antd'
import { CommentOutlined, LikeOutlined, StarFilled, ArrowLeftOutlined, ClockCircleOutlined, UserOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title, Paragraph, Text } = Typography

const mockNews = [
    {
        id: 1,
        title: 'Microsoft Teams dừng gửi email thông báo bản ghi cuộc họp từ 01/06/2026',
        excerpt: 'Thay đổi mới từ Microsoft nhằm giảm thiểu lượng email rác trong hộp thư người dùng. Các thông báo về bản ghi sẽ được tích hợp trực tiếp trong ứng dụng.',
        date: '13/03/2026',
        views: 1250,
        comments: 12,
        category: 'TIN CÔNG NGHỆ',
        image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 2,
        title: 'AMD phát hành driver chipset mới tối ưu hiệu năng cho Windows 11',
        excerpt: 'Bản cập nhật driver mới nhất hứa hẹn cải thiện độ ổn định và quản lý điện năng cho các dòng laptop sử dụng chip Ryzen đời mới.',
        date: '12/03/2026',
        views: 890,
        comments: 5,
        category: 'PHẦN CỨNG',
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 3,
        title: 'Hướng dẫn vệ sinh laptop tại nhà đúng cách, tránh hỏng linh kiện',
        excerpt: 'Vệ sinh định kỳ giúp máy thoát nhiệt tốt hơn và tăng tuổi thọ. Tìm hiểu các bước vệ sinh an toàn mà không cần tháo máy phức tạp.',
        date: '10/03/2026',
        views: 3420,
        comments: 45,
        category: 'THỦ THUẬT',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 4,
        title: 'Chip Qualcomm Elite vượt mặt Intel Panther Lake trong bài test đầu tiên',
        excerpt: 'Kết quả benchmark cho thấy sự bứt phá mạnh mẽ của Qualcomm trong mảng laptop, đe dọa trực tiếp vị thế của Intel trong phân khúc văn phòng.',
        date: '08/03/2026',
        views: 1560,
        comments: 28,
        category: 'CÔNG NGHỆ',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 5,
        title: 'Cách khắc phục lỗi laptop sạc không vào pin đơn giản ngay tại nhà',
        excerpt: 'Pin báo "Plugged in, not charging" là lỗi phổ biến. Kiểm tra ngay 5 nguyên nhân và cách xử lý nhanh trước khi mang ra trung tâm bảo hành.',
        date: '05/03/2026',
        views: 2100,
        comments: 15,
        category: 'SỬA CHỮA',
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 6,
        title: 'Kỷ nguyên AI PC và Windows 12: Tương lai của Laptop năm 2026',
        excerpt: 'Sự kết hợp giữa phần cứng NPU mạnh mẽ và hệ điều hành Windows 12 định hình lại cách chúng ta sử dụng máy tính. AI không còn là tính năng phụ, mà là linh hồn của chiếc laptop hiện đại.',
        date: '14/03/2026',
        views: 4500,
        comments: 32,
        category: 'XU THẾ',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 7,
        title: 'Laptop bắt WiFi yếu, chập chờn? 6 cách khắc phục tức thì không cần thợ',
        excerpt: 'WiFi chập chờn là nỗi ám ảnh hàng đầu của dân văn phòng và sinh viên. Hãy thử ngay 6 mẹo đơn giản này trước khi nghĩ đến việc thay card WiFi.',
        date: '15/03/2026',
        views: 2870,
        comments: 38,
        category: 'THỦ THUẬT',
        image: 'https://images.unsplash.com/photo-1516044734145-07ca8eef8731?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 8,
        title: '10 phím tắt chụp màn hình trên Windows mà 90% người dùng không biết',
        excerpt: 'Ngoài nút Print Screen quen thuộc, Windows còn ẩn giấu hàng loạt tổ hợp phím chụp màn hình cực kỳ tiện lợi. Từ chụp vùng chọn đến quay video màn hình.',
        date: '14/03/2026',
        views: 5120,
        comments: 67,
        category: 'THỦ THUẬT',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 9,
        title: 'Bí quyết kéo dài pin laptop lên gấp đôi mà ít ai để ý',
        excerpt: 'Pin laptop tụt nhanh không phải lúc nào cũng do pin chai. Rất nhiều thiết lập ẩn trong Windows đang ngầm "ngốn" pin của bạn mà bạn không hề hay biết.',
        date: '13/03/2026',
        views: 4300,
        comments: 52,
        category: 'THỦ THUẬT',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800'
    }
]

const NewsList = () => {
    const navigate = useNavigate()

    const featuredTip = {
        id: 'featured-1',
        title: '7 Cách Tăng Tốc Độ Laptop Đơn Giản, Không Cần Ra Tiệm',
        excerpt: 'Trải nghiệm máy tính hoạt động chậm chạp khiến công việc đình trệ? Đừng vội mua máy mới, hãy thử ngay 7 chiêu tối ưu hóa hệ điều hành và dọn rác cực nhẹ máy sau đây.',
        date: 'Hôm nay',
        category: 'THỦ THUẬT',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
    }

    return (
        <div className="bg-gray-50/50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12 flex items-end justify-between border-b pb-4">
                    <div>
                        <Title level={2} className="!mb-2">Tin Tức & Thủ Thuật</Title>
                        <Paragraph className="text-gray-500 m-0 text-base">Cập nhật tin tức thị trường, mẹo sửa lỗi phần mềm và thủ thuật máy tính.</Paragraph>
                    </div>
                </div>

                {/* Featured Post */}
                <Card
                    className="rounded-3xl border-0 overflow-hidden shadow-xl mb-12 p-0 cursor-pointer group hover:shadow-2xl transition-all duration-500"
                    bodyStyle={{ padding: 0 }}
                    onClick={() => navigate(`/news/${featuredTip.id}`)}
                >
                    <Row className="min-h-[400px]">
                        <Col xs={24} md={14} className="relative">
                            <div className="h-full overflow-hidden">
                                <img
                                    src={featuredTip.image}
                                    alt="Featured"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute top-6 left-6">
                                <Text className="bg-primary-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg text-xs tracking-widest uppercase">
                                    {featuredTip.category}
                                </Text>
                            </div>
                        </Col>
                        <Col xs={24} md={10}>
                            <div className="p-8 md:p-12 h-full flex flex-col justify-center bg-white group-hover:bg-primary-50 transition-colors duration-500">
                                <div className="mb-6 flex items-center gap-3">
                                    <Tooltip title="Bài viết mới nhất trong ngày">
                                        <div className="flex items-center gap-2 bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-full text-[10px] tracking-wider animate-pulse">
                                            <ClockCircleOutlined /> {featuredTip.date}
                                        </div>
                                    </Tooltip>
                                    <Text className="text-gray-400 text-sm italic">5 phút đọc</Text>
                                </div>
                                <Title level={2} className="!mb-6 group-hover:text-primary-600 transition-colors leading-tight">
                                    {featuredTip.title}
                                </Title>
                                <Paragraph className="text-gray-500 text-lg mb-10 line-clamp-4 leading-relaxed italic">
                                    "{featuredTip.excerpt}"
                                </Paragraph>
                                <div className="mt-auto">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="gradient-primary border-0 rounded-full px-10 h-14 text-base font-bold shadow-lg group-hover:shadow-primary-200 transition-all flex items-center gap-2"
                                    >
                                        Đọc tiếp <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Grid Posts */}
                <Row gutter={[24, 32]}>
                    {mockNews.map(post => (
                        <Col xs={24} sm={12} lg={8} key={post.id}>
                            <Card
                                className="h-full rounded-2xl border-0 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col cursor-pointer border border-transparent hover:border-primary-100"
                                onClick={() => navigate(`/news/${post.id}`)}
                                cover={
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <Text className="text-white text-xs font-medium">Nhấn để xem chi tiết</Text>
                                        </div>
                                    </div>
                                }
                                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <Text className="text-primary-600 font-bold text-[10px] tracking-widest uppercase">{post.category}</Text>
                                    <div className="flex gap-3 text-xs text-gray-400">
                                        <span>{post.date}</span>
                                        <span className="flex items-center gap-1"><LikeOutlined /> {post.views}</span>
                                    </div>
                                </div>
                                <Title level={5} className="line-clamp-2 !mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                                    {post.title}
                                </Title>
                                <Paragraph className="text-gray-500 text-sm line-clamp-3 flex-1 mb-0">
                                    {post.excerpt}
                                </Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}

const NewsDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // Find article from mockNews or use featured one
    const foundArticle = mockNews.find(n => String(n.id) === id)
    
    // Default fallback if not found
    let article = foundArticle || {
        id: 'featured-1',
        title: '7 Cách Tăng Tốc Độ Laptop Đơn Giản, Không Cần Ra Tiệm',
        excerpt: 'Trải nghiệm máy tính hoạt động chậm chạp khiến công việc đình trệ? Đừng vội mua máy mới, hãy thử ngay 7 chiêu tối ưu hóa hệ điều hành và dọn rác cực nhẹ máy sau đây.',
        date: dayjs().format('DD/MM/YYYY'),
        category: 'THỦ THUẬT',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
    };

    // Initialize content based on ID
    if (id === 'featured-1' || (!foundArticle && id === 'featured-1')) {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl leading-relaxed mb-6 font-medium text-gray-700">Trải nghiệm máy tính hoạt động chậm chạp khiến công việc đình trệ? Đừng vội mang máy ra tiệm hay mua máy mới. Hãy thử ngay 7 chiêu tối ưu hóa hệ điều hành và dọn rác cực nhẹ máy, ai cũng có thể làm được tại nhà.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Laptop đang hoạt động" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Một chiếc laptop được tối ưu tốt sẽ giúp bạn làm việc hiệu quả hơn gấp nhiều lần.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">1. Dọn dẹp ổ cứng (Disk Cleanup) thường xuyên</h3>
                <p class="mb-4">Hệ điều hành Windows luôn âm thầm lưu trữ các file tạm (temp files), cache trình duyệt, file log và các tệp tải xuống không cần thiết. Quá nhiều file rác sẽ làm phân mảnh ổ cứng và chiếm dụng dung lượng trống, khiến Windows mất nhiều thời gian hơn để tìm kiếm dữ liệu.</p>
                <p class="mb-4"><strong>Cách thực hiện:</strong> Mở Start Menu, gõ <code>Disk Cleanup</code>, chọn ổ C: và đánh dấu vào các mục cần xóa (đặc biệt là <em>Temporary files</em> và <em>Recycle Bin</em>), sau đó nhấn OK.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">2. Tắt các ứng dụng chạy ngầm không cần thiết</h3>
                <p class="mb-4">Zalo, Skype, Spotify, OneDrive... rất nhiều ứng dụng tự động thiết lập mặc định khởi động cùng Windows. Chúng ngốn một lượng lớn RAM và tài nguyên CPU ngay từ khi bạn bật máy lên.</p>
                <p class="mb-4"><strong>Cách thực hiện:</strong> Nhấn tổ hợp phím <code>Ctrl + Shift + Esc</code> để mở <strong>Task Manager</strong>. Chuyển sang tab <strong>Startup</strong>, chuột phải vào các ứng dụng không quan trọng và chọn <strong>Disable</strong>.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Gõ phím lập trình" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Tắt ứng dụng chạy ngầm giúp giải phóng hàng GB RAM cho các phần mềm làm việc chính.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">3. Tùy chỉnh hiệu ứng hiển thị (Visual Effects)</h3>
                <p class="mb-4">Windows 11 có giao diện rất đẹp với các hiệu ứng trong suốt (transparency) và đổ bóng (shadow). Tuy nhiên, nếu máy bạn không có card đồ họa mạnh, những hiệu ứng này sẽ làm chậm tốc độ phản hồi của máy.</p>
                <p class="mb-4"><strong>Cách thực hiện:</strong> Nhấn Win + S, gõ <code>Advanced system settings</code>. Ở mục Performance, chọn <code>Settings</code>, sau đó nhấn mục <strong>Adjust for best performance</strong> để tắt toàn bộ hiệu ứng thừa thãi.</p>

                <div class="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 my-8 shadow-sm">
                    <h4 class="text-blue-800 font-bold mb-2 flex items-center gap-2">🛠️ Khi nào cần can thiệp phần cứng?</h4>
                    <p class="text-blue-800 mb-0">Nếu bạn đã làm đủ mọi cách trên phần mềm mà máy khởi động vẫn mất hơn 1 phút, mở trình duyệt vẫn lag, thì đây là lúc bạn <strong>BẮT BUỘC</strong> phải nâng cấp từ ổ HDD cũ kỹ lên ổ cứng <strong>SSD</strong>, đồng thời lắp thêm RAM (khuyến nghị tối thiểu 8GB, tốt nhất là 16GB). Liên hệ LaptopCare để được tư vấn nâng cấp tiết kiệm nhất!</p>
                </div>
            </div>
        `
    }

    // Add content for article 3 (Thủ thuật vệ sinh)
    if (id === '3') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Với thời tiết nóng ẩm và nhiều bụi bẩn, laptop rất dễ bị đóng bụi ở khe tản nhiệt sau 6 tháng sử dụng. Việc vệ sinh định kỳ giúp máy chạy êm, thoát nhiệt tốt và tránh chết phần cứng đột ngột.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">Tại Sao Phải Vệ Sinh Laptop Định Kỳ?</h3>
                <p class="mb-6">Bụi bẩn tích tụ sẽ bít kín khe thoát gió, khiến quạt tản nhiệt phải hoạt động tối đa (gây tiếng ồn lớn) nhưng luồng khí nóng vẫn không thể thoát ra ngoài. Hậu quả là nhiệt độ CPU/GPU tăng vọt lên 90-100 độ C, gây ra hiện tượng <strong>Thermal Throttling</strong> (bóp xung nhịp, làm máy lag điên cuồng), thậm chí là chập cháy mainboard.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Laptop Repair and Cleaning" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Bộ dụng cụ vệ sinh máy tính cơ bản bạn có thể sắm tại nhà.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">Các Bước Vệ Sinh Bên Ngoài Mà Ai Cũng Làm Được</h3>
                <p class="mb-4">Bạn không nhất thiết phải tháo tung máy ra mới có thể vệ sinh. Việc làm sạch bên ngoài cũng giúp ích rất nhiều:</p>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Vệ sinh bàn phím:</strong> Dùng chổi cọ mềm quét dọc các khe phím để đẩy bụi/tóc. Bạn có thể mua một bình xịt khí nén (Air duster) để xịt bay các hạt bụi cứng đầu nằm sâu dưới chân phím. Tránh ăn uống trực tiếp trên bàn phím.</li>
                    <li><strong>Lau màn hình đúng chuẩn:</strong> CHỈ SỬ DỤNG khăn sợi Microfiber (khăn lau kính mắt). Khẽ phun nước rửa kính chuyên dụng hoặc cồn isopropyl 70% lên KHĂN (tuyệt đối không phun trực tiếp lên màn hình), sau đó lau nhẹ nhàng theo vòng tròn. Không dùng lực tì mạnh lên tấm nền.</li>
                    <li><strong>Hút bụi các khe thoát nhiệt:</strong> Dùng máy hút bụi mini áp sát vào các nắp thông gió và rãnh tản nhiệt ở mặt đáy và cạnh bên máy để rút bớt các cục bụi bông lớn.</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Cleaning laptop keyboard" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Luôn nhớ tắt nguồn và rút sạc máy trước khi tiến hành lau chùi.</figcaption>
                </figure>

                <div class="bg-yellow-50 p-6 rounded-2xl border-l-4 border-yellow-500 my-8 shadow-sm">
                    <h4 class="text-yellow-800 font-bold mb-2 flex items-center gap-2">⚠️ Vệ Sinh Chuyên Sâu Cần Có Kinh Nghiệm</h4>
                    <p class="text-yellow-800 mb-0">Nếu máy của bạn đã sử dụng hơn 1 năm, keo tản nhiệt bên trong đã khô cứng. Lúc này, bạn cần tháo bộ vỏ, gỡ ống đồng tản nhiệt để tra keo mới (như MX-4, Kryonaut). Việc này đòi hỏi kỹ thuật tháo lắp chuyên nghiệp để tránh gãy lẫy nhựa hoặc làm hỏng socket. Hãy book lịch vệ sinh chuyên sâu ngay tại LaptopCare chỉ với 150.000đ!</p>
                </div>
            </div>
        `
    }

    // Add content for article 5 (Sửa chữa)
    if (id === '5') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Bạn cắm sạc nhưng biểu tượng pin ở thanh Taskbar không hiện hình tia sét báo sạc? Hay báo "Plugged in, not charging"? Đừng vội mang máy ra tiệm ngay, hãy tự kiểm tra qua các bước đơn giản lập tức bắt mạch bệnh cho laptop của bạn.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">Pin Báo "Plugged in, not charging" Là Lỗi Gì?</h3>
                <p class="mb-6">Đây là hiện tượng máy tính nhận biết có nguồn điện từ Adapter cắm vào, nhưng dòng điện lại không được nạp vào viên Pin. Rất nhiều trường hợp đây không phải là lỗi phần cứng hỏng hóc, mà do phần mềm hoặc các cài đặt bảo vệ pin của nhà sản xuất (như Dell Power Manager, Lenovo Vantage, Asus MyAsus,...).</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1585842858712-ff59f2af4b83?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Cắm sạc laptop" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Hãy chắc chắn rằng nguồn điện ổ cắm và dây sạc đều hoạt động bình thường trước tiên.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">5 Bước Khắc Phục Nhanh Ngay Tại Nhà</h3>
                
                <h4 class="text-lg font-bold">Bước 1: Kiểm tra ổ cắm điện và củ sạc (Adapter)</h4>
                <p class="mb-4">Bạn hãy cắm sạc sang một ổ điện khác trong nhà. Hãy dùng tay sờ củ sạc xem có ấm không, nếu củ sạc lạnh ngắt thì khả năng cao dây sạc gãy đứt ngầm hoặc củ sạc đã cháy.</p>

                <h4 class="text-lg font-bold">Bước 2: Xả tĩnh điện (Hard Reset)</h4>
                <p class="mb-4">Tĩnh điện thừa tích tụ trong các linh kiện đôi khi gây lỗi nhận sạc. Hãy: Tháo adapter > Tắt máy hoàn toàn > Tháo rời pin ra ngoài (nếu là pin tháo rời) > <strong>Nhấn và giữ nút Nguồn trong 30-45 giây</strong> > Sau đó lắp pin vào, cắm sạc lại và bật máy.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Pin laptop và bảng mạch" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Tĩnh điện là nguyên nhân ngầm gây ra nhiều hiện tượng loạn chức năng trên bo mạch chủ.</figcaption>
                </figure>

                <h4 class="text-lg font-bold">Bước 3: Gỡ và cài lại Driver quản lý pin</h4>
                <p class="mb-4">Nhấn chuột phải vào Start > Chọn <strong>Device Manager</strong>. Tìm đến nhánh <strong>Batteries</strong>, nhấn chuột phải vào <em>"Microsoft ACPI-Compliant Control Method Battery"</em> và chọn <strong>Uninstall device</strong>. Sau đó khởi động lại máy để Windows tự động cài lại driver mới nhất.</p>

                <h4 class="text-lg font-bold">Bước 4: Kiểm tra tính năng "Battery Conservation"</h4>
                <p class="mb-6">Nhiều hãng set mặc định tính năng bảo vệ tuổi thọ pin: máy sẽ KHÔNG SẠC khi pin đang trên 60% hoặc 80%. Bạn cần mở phần mềm quản lý của hãng (ví dụ: Lenovo Vantage, rút bỏ tùy chọn Conservation Mode) để sạc đầy 100% bình thường.</p>

                <div class="bg-red-50 p-6 rounded-2xl border-l-4 border-red-500 my-8 shadow-sm">
                    <h4 class="text-red-800 font-bold mb-2 flex items-center gap-2">⚠️ Khi nào cần mang ra kỹ thuật viên?</h4>
                    <p class="text-red-800 mb-0">Nếu làm hết các bước trên nhưng vẫn không được, hoặc biểu tượng pin có vạch chéo đỏ (X), 90% viên pin của bạn đã bị phồng, cell pin chết hoàn toàn, hoặc nghiêm trọng hơn là hỏng IC mạch sạc trên Mainboard. Hãy tắt máy và mang tới LaptopCare để kỹ thuật viên đo đạc bằng đồng hồ đồng nhất.</p>
                </div>
            </div>
        `
    }
    if (id === '6') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Năm 2026 đánh dấu bước ngoặt lịch sử của ngành máy tính cá nhân khi AI không còn là một công cụ bổ trợ đơn thuần, mà trở thành trung tâm của mọi trải nghiệm trên chiếc AI PC thế hệ mới.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">1. Sự bùng nổ của NPU (Neural Processing Unit)</h3>
                <p class="mb-6">Khác với các dòng laptop truyền thống, AI PC được trang bị bộ xử lý thần kinh chuyên dụng (NPU). Điều này cho phép máy tính xử lý các tác vụ trí tuệ nhân tạo như xóa phông nền video call, dịch thuật trực tiếp hay tối ưu hóa thời lượng pin ngay trên thiết bị mà không cần tới kết nối đám mây, giúp tăng tốc độ xử lý và bảo mật dữ liệu tuyệt đối.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">2. Windows 12: Hệ điều hành của tương lai</h3>
                <p class="mb-6">Microsoft dự kiến sẽ tích hợp sâu Copilot vào nhân của Windows 12. Giao diện người dùng sẽ được cá nhân hóa hoàn toàn dựa trên thói quen làm việc của bạn. Thanh Taskbar thông minh sẽ tự động gợi ý các ứng dụng và tệp tin bạn cần dựa trên ngữ cảnh thời gian và địa điểm.</p>

                <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl my-8 shadow-lg" alt="AI Technology" />

                <h3 class="text-2xl font-bold mb-4 mt-8">3. Trải nghiệm người dùng được định nghĩa lại</h3>
                <p class="mb-6">Với AI Agent, bạn không còn phải tự tay thực hiện các công việc tẻ nhạt. AI có thể hiểu yêu cầu: "Hãy tổng hợp các email nhận được sáng nay và tạo một bản nháp báo cáo dạng slide" và thực hiện nó một cách hoàn hảo trong vài giây.</p>

                <div class="bg-gradient-to-r from-primary-600 to-purple-600 p-8 rounded-3xl text-white my-10 shadow-xl">
                    <h4 class="text-xl font-bold mb-4 text-white">Bạn đã sẵn sàng cho kỷ nguyên mới?</h4>
                    <p class="mb-0 text-white/90 italic">LaptopCare hiện đã bắt đầu cung cấp các dòng máy AI PC mới nhất từ Dell, HP và Lenovo. Hãy đến cửa hàng để trải nghiệm sự khác biệt ngay hôm nay!</p>
                </div>
            </div>
        `
    }

    // Add content for article 1 (Microsoft Teams)
    if (id === '1') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Thay đổi lớn từ Microsoft nhằm giải quyết "vấn nạn" quá tải email trong môi trường doanh nghiệp. Từ nay, mọi thông báo về bản ghi cuộc họp sẽ được tích hợp trực tiếp và thông minh ngay trong Microsoft Teams.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">Chấm Dứt Kỷ Nguyên "Bão Email" Hành Hạ Dân Văn Phòng</h3>
                <p class="mb-6">Bắt đầu từ ngày 01/06/2026, Microsoft Teams chính thức ngừng gửi các email tự động thông báo mỗi khi một bản ghi cuộc họp (meeting recording) hoàn tất xử lý. Quyết định này được Microsoft đưa ra sau khi nghiên cứu hàng triệu phản hồi từ người dùng doanh nghiệp - những người đang phải vật lộn mỗi ngày với hàng chục, thậm chí hàng trăm email thông báo tự động từ hệ sinh thái Microsoft 365, khiến họ dễ bỏ lỡ các email quan trọng thực sự.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Nhân viên văn phòng kiểm tra email" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Hàng loạt email tự động sẽ không còn làm phiền không gian làm việc của bạn.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">Bản Ghi Cuộc Họp Sẽ Nằm Ở Đâu?</h3>
                <p class="mb-6">Đừng lo lắng về việc thất lạc dữ liệu. Thay vì nhận link qua email, người dùng sẽ nhận được thông báo đẩy (push notification) trực tiếp bên trong ứng dụng Microsoft Teams thông qua tab <strong>Activity (Hoạt động)</strong>. Thuật toán mới cũng sẽ ưu tiên hiển thị thông báo bản ghi dựa trên mức độ tham gia của bạn vào cuộc họp đó.</p>

                <h4 class="text-xl font-semibold mb-3">Về mặt lưu trữ vật lý:</h4>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Với cuộc họp thông thường:</strong> Người tổ chức (Organizer) có thể tìm thấy bản ghi gốc được lưu an toàn trong thư mục "Recordings" trên tài khoản OneDrive cá nhân của họ.</li>
                    <li><strong>Với cuộc họp trong Channel (Kênh):</strong> Bản ghi sẽ tự động được đồng bộ và sao lưu vào thư mục của Kênh đó trên hệ thống SharePoint của công ty.</li>
                    <li><strong>Dễ dàng nhất:</strong> Link xem lại bản ghi sẽ luôn được ghim sẵn trong phần lịch sử chat của chính cuộc họp đó, giúp tất cả thành viên dễ dàng truy cập lại bất cứ lúc nào.</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Microsoft Teams Interface" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Giao diện Microsoft Teams sẽ là trung tâm duy nhất cho mọi thông báo cuộc họp.</figcaption>
                </figure>

                <div class="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 my-8 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-blue-800 font-bold mb-2 flex items-center gap-2">💡 Lời khuyên cho bạn</h4>
                    <p class="text-blue-800 mb-0">Để không bao giờ bỏ lỡ các thông báo quan trọng nhất trong Teams (đặc biệt là với thiết lập mới này), hãy vào phần <strong>Settings &gt; Notifications</strong>. Tại đây, bạn có thể thiết lập quyền ưu tiên (Priority) hoặc ghim (Pin) thông báo từ tiến trình của các cuộc họp định kỳ quan trọng.</p>
                </div>
            </div>
        `
    }

    // Add content for article 2 (AMD)
    if (id === '2') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Động thái mới nhất từ "Đội đỏ" AMD mang đến tin vui lớn cho người dùng Windows 11. Bản cập nhật driver chipset toàn diện này không chỉ vá lỗi mà còn hứa hẹn khai mở tối đa tiềm năng hiệu năng của các dòng CPU Ryzen trên nền tảng hệ điều hành mới nhất.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">Tối Ưu Sâu Cốt Lõi Kiến Trúc Zen</h3>
                <p class="mb-6">Sáng nay, AMD đã chính thức phát hành bản cập nhật Driver Chipset phiên bản 6.xx mới nhất, nhắm trực tiếp vào việc tối ưu hóa mức độ tương thích giữa nhân xử lý Ryzen và bộ lập lịch phân luồng (Thread Scheduler) của Windows 11 25H2. Theo công bố kỹ thuật, bản cập nhật này cấu trúc lại cách Windows phân bổ công việc (workloads) giữa các nhân hiệu năng cao (P-cores) và nhân tiết kiệm điện ưu việt của AMD.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="AMD Ryzen Processor Inside Laptop" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Bản cập nhật giúp CPU Ryzen giao tiếp mượt mà hơn với Windows 11.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">Cải Thiện Trải Nghiệm Thực Tế</h3>
                <p class="mb-6">Điều này có ý nghĩa gì với người dùng phổ thông và game thủ? Kết quả kiểm thử sớm từ các studio công nghệ lớn cho thấy sự khác biệt rõ rệt:</p>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Giảm giật lag (Stuttering):</strong> Hiện tượng sụt khung hình đột ngột khi chơi game nặng do lỗi phân luồng trên Windows 11 đã được khắc phục hoàn toàn ở hơn 90% tựa game phổ biến.</li>
                    <li><strong>Tiết kiệm pin đáng kinh ngạc:</strong> Hệ thống quản lý điện năng AMD Power Profile được viết lại giúp các mẫu máy tính xách tay sử dụng Ryzen 7000 và 8000 series có thể kéo dài thêm từ 45 phút đến 1,5 giờ thời lượng pin khi xem video và lướt web.</li>
                    <li><strong>Nhiệt độ ổn định:</strong> Quá trình chuyển đổi trạng thái nghỉ (idle) sang tải nặng (full load) diễn ra trơn tru hơn, giúp quạt tản nhiệt không bị rú đột ngột.</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="High Performance Gaming Laptop" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Game thủ là những người được hưởng lợi lớn nhất từ sự ổn định khung hình.</figcaption>
                </figure>

                <div class="bg-red-50 p-6 rounded-2xl border-l-4 border-red-500 my-8 shadow-sm hover:shadow-md transition-shadow">
                    <h4 class="text-red-800 font-bold mb-2 flex items-center gap-2">⚠️ Hướng Dẫn Cập Nhật An Toàn</h4>
                    <p class="text-red-800 mb-0">Người dùng có thể tự tải bản cập nhật này trực tiếp từ trang chủ AMD hoặc thông qua ứng dụng AMD Adrenalin. Tuy nhiên, để đảm bảo an toàn tối đa cho hệ điều hành, LaptopCare khuyến nghị bạn sao lưu các dữ liệu quan trọng trước khi tiến hành cập nhật driver cấp thấp (chipset). Nếu gặp khó khăn, hãy ghé ngay cơ sở LaptopCare gần nhất để được hỗ trợ miễn phí!</p>
                </div>
            </div>
        `
    }

    // Add content for article 4 (Qualcomm vs Intel)
    if (id === '4') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Trận chiến vi xử lý trên laptop Windows đang bước vào giai đoạn khốc liệt nhất lịch sử. Kết quả benchmark rò rỉ mới nhất cho thấy sự bứt phá đáng kinh ngạc của nền tảng ARM, khi chip Snapdragon X Elite thế hệ 2 từ Qualcomm dường như đã làm được điều không tưởng: vượt mặt "quái vật" Panther Lake của Intel.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">Điểm Số Geekbench 6 Gây Chấn Động Giới Công Nghệ</h3>
                <p class="mb-6">Sáng sớm hôm nay, trên cơ sở dữ liệu của phần mềm đo lường hiệu năng Geekbench 6, cộng đồng mạng đã lan truyền chóng mặt bảng kết quả của một thiết bị thử nghiệm (prototype) chạy vi xử lý mã hiệu "Qualcomm Oryon V2" - được cho là Snapdragon X Elite Gen 2.</p>
                <p class="mb-6">Cụ thể, con chip ARM này đã xác lập kỷ lục mới với <strong>3,245 điểm đơn nhân</strong> và con số khổng lồ <strong>17,120 điểm đa nhân</strong>. Để thấy được độ "khủng" của kết quả này, chúng ta cần so sánh với mẫu thử nghiệm cao cấp nhất của Intel là Core Ultra 9 (kiến trúc Panther Lake thế hệ mới), vốn "chỉ" đạt mức 15,820 điểm đa nhân trong cùng điều kiện bài test và khung tản nhiệt.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Microchip Macro" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Cận cảnh một bảng mạch điện tử - Nơi "trái tim" của các hệ thống máy tính đang so kè khốc liệt.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">Bí Mật Nằm Ở Kiến Trúc Oryon Tùy Chỉnh Định Cỡ Lại</h3>
                <p class="mb-6">Giới phân tích phần cứng đánh giá cao quyết định táo bạo của Qualcomm khi làm lại hoàn toàn bộ nhớ đệm L2 và L3 trên kiến trúc CPU Oryon v2. Thay vì dựa dẫm vào thiết kế tiêu chuẩn của ARM, Qualcomm đã:</p>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Tối ưu hóa tập lệnh vi mô (Micro-architecture):</strong> Giúp xử lý các tác vụ đa luồng hạng nặng (render video, biên dịch code) nhanh hơn tới 25% so với thế hệ đầu.</li>
                    <li><strong>Băng thông bộ nhớ đột phá:</strong> Nâng cấp hỗ trợ RAM LPDDR5x lên tốc độ cực đại 9600 MT/s, ngang ngửa tốc độ truyền tải của các card đồ họa rời.</li>
                    <li><strong>Kiểm soát nhiệt (Thermal Throttling) xuất sắc:</strong> Chip tiêu thụ điện năng (TDP) ở mức đỉnh chỉ 45W nhưng cho hiệu năng tương đương chip x86 tiêu thụ 80W.</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1531297172323-9528d2ce451e?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Modern Thin and Light Laptop" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Kỷ nguyên của những chiếc Laptop siêu mỏng, pin cực trâu nhưng mạnh ngang máy tính bàn đang đến gần.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">Bức Tranh Toàn Cảnh: Cuộc Chiến Bắt Đầu Chuyển Ngôi?</h3>
                <p class="mb-6">Sự trỗi dậy của nền tảng ARM trên PC không còn là trò đùa hay "thử nghiệm" nữa. Với lớp giả lập Prism x86 ngày càng hoàn hảo trên Windows 11 và sắp tới là Windows 12, rào cản về phần mềm không tương thích đang dần biến mất. Người dùng chuyên nghiệp có thể sẽ bắt đầu thực sự cân nhắc chuyển dịch sang laptop ARM bởi sự cám dỗ khó cưỡng: <strong>hiệu năng vô đối đi kèm thời lượng pin xuyên ngày.</strong></p>
                <p class="mb-6">Đối với Intel và AMD, đây là một thách thức sinh tử. Họ sẽ phải tìm ra giải pháp kiến trúc đột phá, ép xung giới hạn tiết kiệm năng lượng triệt để hơn nữa nếu không muốn bị đánh bật khỏi phân khúc laptop siêu mỏng nhẹ béo bở nhất thị trường.</p>
            </div>
        `
    }

    // Add content for article 7 (WiFi yếu)
    if (id === '7') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">WiFi chập chờn, tín hiệu yếu ớt dù ngồi cách router chỉ vài mét? Trước khi vội vàng gọi thợ hoặc nghĩ đến việc thay card WiFi tốn kém, hãy thử ngay 6 cách khắc phục miễn phí tại nhà dưới đây.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">1. Khởi Động Lại Router Và Laptop</h3>
                <p class="mb-6">Nghe có vẻ đơn giản nhưng đây là giải pháp cứu cánh trong hơn 40% trường hợp. Hãy rút nguồn router, đợi 30 giây rồi cắm lại. Đồng thời, khởi động lại laptop để driver WiFi được "reset" sạch sẽ.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Router WiFi" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Một thao tác nhỏ - khởi động lại router - có thể giải quyết phần lớn sự cố kết nối.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">2. Cập Nhật Hoặc Cài Lại Driver WiFi</h3>
                <p class="mb-4">Driver WiFi lỗi thời hoặc bị conflict là nguyên nhân phổ biến thứ hai. Hãy:</p>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li>Mở <strong>Device Manager</strong> > Mục <strong>Network Adapters</strong></li>
                    <li>Click chuột phải vào card WiFi > Chọn <strong>Update driver</strong></li>
                    <li>Nếu không ăn thua, chọn <strong>Uninstall device</strong> rồi khởi động lại máy. Windows sẽ tự cài lại driver mới nhất.</li>
                </ul>

                <h3 class="text-2xl font-bold mb-4 mt-8">3. Thay Đổi Kênh WiFi (Channel)</h3>
                <p class="mb-6">Nếu bạn ở chung cư hoặc khu vực đông router, các kênh WiFi bị "nghẽn" là chuyện thường. Truy cập trang quản trị router (thường là <code>192.168.1.1</code>), tìm mục <strong>Wireless Settings</strong> và chuyển Channel từ Auto sang một kênh ít sử dụng hơn (ví dụ: kênh 1, 6, hoặc 11 cho băng tần 2.4GHz).</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">4. Tắt Tính Năng Tiết Kiệm Pin Cho Card WiFi</h3>
                <p class="mb-6">Windows mặc định cho phép tắt card WiFi để tiết kiệm pin, dẫn đến mất kết nối ngẫu nhiên. Vào <strong>Device Manager</strong> > click đúp vào card WiFi > Tab <strong>Power Management</strong> > <strong>BỎ DẤU TICK</strong> ở mục "Allow the computer to turn off this device to save power".</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Mạng và kết nối" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Một thay đổi nhỏ trong Power Management có thể chấm dứt tình trạng WiFi mất kết nối liên tục.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">5. Xóa DNS Cache & Đổi DNS</h3>
                <p class="mb-6">Mở <strong>Command Prompt</strong> (Run as Admin) và gõ lần lượt: <code>ipconfig /flushdns</code> rồi <code>ipconfig /release</code> rồi <code>ipconfig /renew</code>. Ngoài ra, hãy đổi DNS sang Google (8.8.8.8 / 8.8.4.4) hoặc Cloudflare (1.1.1.1) để tăng tốc phân giải tên miền.</p>

                <div class="bg-green-50 p-6 rounded-2xl border-l-4 border-green-500 my-8 shadow-sm">
                    <h4 class="text-green-800 font-bold mb-2">✅ Mẹo Pro</h4>
                    <p class="text-green-800 mb-0">Nếu laptop của bạn hỗ trợ băng tần 5GHz, hãy ưu tiên kết nối vào mạng 5GHz (thường có hậu tố "_5G"). Băng tần này ít bị nhiễu hơn, tốc độ nhanh hơn đáng kể so với 2.4GHz, đặc biệt trong phạm vi gần router.</p>
                </div>
            </div>
        `
    }

    // Add content for article 8 (Phím tắt chụp màn hình)
    if (id === '8') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Bạn vẫn chỉ dùng nút Print Screen rồi dán vào Paint? Windows có hàng loạt tổ hợp phím chụp màn hình tiện dụng hơn rất nhiều mà phần lớn người dùng chưa từng biết đến.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">Nhóm 1: Chụp Nhanh Toàn Bộ Màn Hình</h3>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Print Screen (PrtSc):</strong> Chụp toàn bộ màn hình, lưu vào Clipboard. Bạn cần dán (Ctrl+V) vào Paint hoặc Word để sử dụng.</li>
                    <li><strong>Win + Print Screen:</strong> Chụp toàn bộ màn hình và <strong>TỰ ĐỘNG LƯU</strong> thành file PNG vào thư mục <code>Pictures > Screenshots</code>. Không cần dán thủ công!</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Bàn phím laptop" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Thành thạo các phím tắt giúp bạn làm việc nhanh gấp 3 lần so với thao tác chuột.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">Nhóm 2: Chụp Vùng Chọn Tự Do</h3>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Win + Shift + S (Snipping Tool):</strong> Đây là "vũ khí tối thượng"! Màn hình sẽ tối lại và bạn có thể kéo chuột chọn bất kỳ vùng nào để chụp. Ảnh sẽ lưu vào Clipboard, đồng thời hiện thông báo để bạn chỉnh sửa hoặc lưu file ngay.</li>
                    <li><strong>Alt + Print Screen:</strong> Chỉ chụp <strong>CỬA SỔ ĐANG HOẠT ĐỘNG</strong> (active window), bỏ qua mọi thứ phía sau. Rất tiện khi bạn muốn chụp riêng một ứng dụng.</li>
                </ul>

                <h3 class="text-2xl font-bold mb-4 mt-8">Nhóm 3: Quay Video Màn Hình (Ít Ai Biết!)</h3>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Win + Alt + R (Xbox Game Bar):</strong> Bắt đầu/dừng quay video màn hình ngay lập tức! File MP4 sẽ được lưu tự động vào thư mục <code>Videos > Captures</code>.</li>
                    <li><strong>Win + G:</strong> Mở bảng điều khiển Xbox Game Bar đầy đủ với các widget chụp ảnh, quay phim, thu âm, theo dõi hiệu năng.</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Màn hình máy tính" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Win + Shift + S là tổ hợp phím chụp mà mọi dân văn phòng nên thuộc lòng.</figcaption>
                </figure>

                <div class="bg-purple-50 p-6 rounded-2xl border-l-4 border-purple-500 my-8 shadow-sm">
                    <h4 class="text-purple-800 font-bold mb-2">🎯 Bảng Tóm Tắt Nhanh</h4>
                    <p class="text-purple-800 mb-0"><strong>PrtSc</strong> = Chụp toàn bộ vào Clipboard · <strong>Win+PrtSc</strong> = Chụp + tự lưu file · <strong>Win+Shift+S</strong> = Chụp vùng chọn · <strong>Alt+PrtSc</strong> = Chụp cửa sổ hiện tại · <strong>Win+Alt+R</strong> = Quay video màn hình · <strong>Win+G</strong> = Mở Game Bar</p>
                </div>
            </div>
        `
    }

    // Add content for article 9 (Kéo dài pin)
    if (id === '9') {
        article.content = `
            <div class="prose prose-lg max-w-none">
                <p class="text-xl font-medium leading-relaxed mb-8 text-gray-600">Laptop của bạn hết pin chỉ sau 2-3 tiếng sử dụng? Đừng vội kết luận pin đã chai. Có rất nhiều thiết lập ẩn trong Windows đang lặng lẽ "ngốn" pin mà bạn hoàn toàn có thể tắt chúng đi để kéo dài thời lượng sử dụng lên gấp đôi.</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">1. Bật Chế Độ Tiết Kiệm Pin Thông Minh</h3>
                <p class="mb-6">Windows 11 có tính năng <strong>Battery Saver</strong> tích hợp sẵn nhưng ít ai kích hoạt chủ động. Vào <strong>Settings > System > Power & battery</strong>. Bật <strong>Battery saver</strong> và thiết lập tự động kích hoạt khi pin dưới 30%. Chế độ này sẽ tự giảm độ sáng, tắt các app chạy nền và hạn chế push notifications.</p>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Laptop đang sạc" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Quản lý pin hiệu quả giúp laptop của bạn đồng hành cả ngày dài làm việc mà không lo hết điện.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">2. Giảm Độ Sáng Và Tắt Đèn Bàn Phím</h3>
                <p class="mb-6">Màn hình là "ông vua" ngốn pin. Giảm độ sáng xuống mức 40-50% có thể tiết kiệm tới <strong>30% thời lượng pin</strong>. Đồng thời, nếu laptop có đèn nền bàn phím (backlit keyboard), hãy tắt nó khi không cần thiết bằng phím tắt <code>Fn + F5</code> (hoặc Fn + phím có biểu tượng đèn).</p>

                <h3 class="text-2xl font-bold mb-4 mt-8">3. Tắt Các Ứng Dụng Chạy Nền "Ẩn"</h3>
                <p class="mb-4">Nhiều app âm thầm chạy nền mà bạn không hay biết:</p>
                <ul class="list-disc pl-6 mb-8 text-gray-700 space-y-3">
                    <li><strong>Cortana / Copilot:</strong> Nếu không dùng, hãy tắt trong Settings > Privacy.</li>
                    <li><strong>OneDrive sync:</strong> Tạm pause khi dùng pin bằng cách click phải icon OneDrive > Pause syncing.</li>
                    <li><strong>Windows Update:</strong> Vào Settings > Windows Update > Active hours để tránh máy tự cập nhật khi đang chạy pin.</li>
                    <li><strong>Bluetooth:</strong> Tắt hoàn toàn nếu không kết nối thiết bị nào qua Action Center (Win + A).</li>
                </ul>

                <figure class="my-8">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" class="w-full rounded-3xl shadow-lg object-cover h-[400px]" alt="Làm việc với laptop" />
                    <figcaption class="text-center text-gray-500 text-sm mt-3 italic">Chỉ cần vài thao tác tối ưu, laptop có thể trụ được cả ngày làm việc 8 tiếng mà không cần sạc.</figcaption>
                </figure>

                <h3 class="text-2xl font-bold mb-4 mt-8">4. Chọn Gói Hiệu Năng "Best Power Efficiency"</h3>
                <p class="mb-6">Đây là bước quan trọng nhất mà ít người biết. Click vào biểu tượng Pin ở Taskbar, kéo thanh trượt <strong>Power mode</strong> sang <strong>"Best power efficiency"</strong>. Windows sẽ tự động ép xung CPU xuống mức thấp hơn, giảm hiệu năng GPU rời (nếu có), ưu tiên tối đa thời lượng pin.</p>

                <div class="bg-green-50 p-6 rounded-2xl border-l-4 border-green-500 my-8 shadow-sm">
                    <h4 class="text-green-800 font-bold mb-2">🔋 Kết Quả Thực Tế</h4>
                    <p class="text-green-800 mb-0">Theo thử nghiệm của LaptopCare trên các mẫu laptop phổ biến (Dell Latitude, Lenovo ThinkPad, HP ProBook), áp dụng đồng thời tất cả các mẹo trên có thể kéo dài pin từ <strong>3 giờ lên 5-6 giờ</strong> sử dụng liên tục với tác vụ văn phòng và lướt web. Nếu pin vẫn tụt quá nhanh sau khi đã tối ưu, rất có thể viên pin đã chai và cần được thay thế. Hãy ghé LaptopCare để kiểm tra miễn phí!</p>
                </div>
            </div>
        `
    }


    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/news')}
                className="mb-8 hover:text-primary-600 flex items-center gap-2 border-0 shadow-sm bg-white rounded-full px-6 h-10"
            >
                Quay lại danh sách
            </Button>

            <div className="mb-8">
                <Text className="text-primary-600 font-bold tracking-widest uppercase block mb-3">{article.category || 'TIN TỨC'}</Text>
                <Title level={1} className="!mb-6 leading-tight !text-4xl md:!text-5xl">{article.title}</Title>

                <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-2"><ClockCircleOutlined /> {article.date}</div>
                    <div className="flex items-center gap-2"><UserOutlined /> LaptopCare Team</div>
                    <div className="flex items-center gap-2 text-primary-500 font-medium"><LikeOutlined /> {article.views || 0} lượt xem</div>
                    <Button icon={<ShareAltOutlined />} type="text" className="ml-auto text-gray-400 hover:text-primary-600">Chia sẻ</Button>
                </div>
            </div>

            <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl h-[300px] md:h-[500px]">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
                {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                    <>
                        <p className="text-xl mb-6 font-medium leading-relaxed italic text-gray-500 border-l-4 border-gray-200 pl-6">{article.excerpt}</p>
                        <p className="mb-4">Nội dung chi tiết của bài viết đang được cập nhật. Vui lòng quay lại sau...</p>
                        <div className="h-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 italic">
                            Đang tải thêm nội dung bài viết...
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const News = () => {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route index element={<NewsList />} />
                <Route path=":id" element={<NewsDetail />} />
            </Routes>
        </div>
    )
}

export default News
