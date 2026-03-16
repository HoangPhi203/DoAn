import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Drawer, Space, Typography, Avatar, Dropdown, Input } from 'antd'
import {
    HomeOutlined,
    SearchOutlined,
    CalendarOutlined,
    LoginOutlined,
    UserAddOutlined,
    MenuOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    LaptopOutlined,
    ToolOutlined,
    UserOutlined,
    LogoutOutlined,
    InfoCircleOutlined,
    AppstoreOutlined,
    BuildOutlined,
    ReadOutlined,
    FileTextOutlined,
    ContactsOutlined,
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import AIChatBot from '../components/AIChatBot'

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const location = useLocation()
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuth()

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: 'Trang chủ' },
        { key: '/about', icon: <InfoCircleOutlined />, label: 'Giới thiệu' },

        {
            key: '/news',
            icon: <ReadOutlined />,
            label: 'Tin tức'
        },
        {
            key: '/pricing',
            icon: <FileTextOutlined />,
            label: 'Báo giá'
        },
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleSearch = (value) => {
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value.trim())}`)
        }
    }

    const getDashboardLink = () => {
        if (!user) return '/'
        const routes = {
            admin: '/admin',
            receptionist: '/receptionist',
            technician: '/technician',
            customer: '/',
        }
        return routes[user.role] || '/'
    }

    const userMenuItems = [
        {
            key: 'dashboard',
            icon: <LaptopOutlined />,
            label: 'Bảng điều khiển',
            onClick: () => navigate(getDashboardLink()),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ]

    return (
        <Layout className="min-h-screen">
            {/* Header - Two rows */}
            <div className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)' }}>
                {/* Top Row - Logo + Search + Auth */}
                <div
                    className="px-4 md:px-8 flex items-center justify-between"
                    style={{
                        height: 64,
                        borderBottom: '1px solid var(--color-border)',
                    }}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 no-underline shrink-0">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <ToolOutlined className="text-white text-xl" />
                        </div>
                        <div className="hidden sm:block">
                            <Title level={4} className="!mb-0 !text-lg gradient-text">
                                LaptopCare
                            </Title>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4 md:mx-8">
                        <Input.Search
                            placeholder="Tìm kiếm dịch vụ, sản phẩm..."
                            allowClear
                            size="large"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onSearch={handleSearch}
                            className="header-search"
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        <a href="tel:0383634255" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
                            <PhoneOutlined className="text-xl" style={{ color: '#e53e3e' }} />
                            <div className="flex flex-col leading-tight text-center">
                                <span className="text-xs text-gray-500 font-medium">Hotline</span>
                                <span className="text-sm font-medium" style={{ color: '#e53e3e' }}>0383634255</span>
                            </div>
                        </a>
                        {isAuthenticated ? (
                            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                                    <Avatar
                                        icon={<UserOutlined />}
                                        className="bg-primary-600"
                                    />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">{user.name}</div>
                                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                                    </div>
                                </div>
                            </Dropdown>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button icon={<LoginOutlined />} type="primary" className="gradient-primary border-0">Đăng nhập</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        className="md:hidden"
                        type="text"
                        icon={<MenuOutlined className="text-xl" />}
                        onClick={() => setMobileMenuOpen(true)}
                    />
                </div>

                {/* Bottom Row - Navigation Links */}
                <div
                    className="hidden md:block px-4 md:px-8"
                    style={{
                        background: 'rgba(255, 255, 255, 0.98)',
                        borderBottom: '1px solid var(--color-border)',
                    }}
                >
                    <div className="max-w-7xl mx-auto">
                        <Menu
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            items={menuItems.map(item => ({
                                ...item,
                                label: <Link to={item.key}>{item.label}</Link>,
                            }))}
                            className="border-none bg-transparent"
                            style={{ display: 'flex', justifyContent: 'center' }}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <Drawer
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <ToolOutlined className="text-white" />
                        </div>
                        <span className="font-semibold">LaptopCare</span>
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
            >
                <div className="flex flex-col gap-2">
                    {menuItems.map(item => (
                        <Link
                            key={item.key}
                            to={item.key}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline transition-colors ${location.pathname === item.key
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div className="border-t my-4" />

                    {isAuthenticated ? (
                        <>
                            <div className="px-4 py-2 flex items-center gap-3">
                                <Avatar icon={<UserOutlined />} className="bg-primary-600" />
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.role}</div>
                                </div>
                            </div>
                            <Link
                                to={getDashboardLink()}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-gray-700 hover:bg-gray-50"
                            >
                                <LaptopOutlined />
                                <span>Bảng điều khiển</span>
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout()
                                    setMobileMenuOpen(false)
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left border-none bg-transparent cursor-pointer"
                            >
                                <LogoutOutlined />
                                <span>Đăng xuất</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-gray-700 hover:bg-gray-50"
                            >
                                <LoginOutlined />
                                <span>Đăng nhập</span>
                            </Link>
                        </>
                    )}
                </div>
            </Drawer>

            {/* Main Content */}
            <Content className="mt-[110px]">
                <Outlet />
            </Content>

            {/* Footer */}
            <Footer className="bg-gray-900 text-white !p-0">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex flex-col gap-2 text-sm text-gray-400">
                                <div className="flex mb-2">
                                    <span className="text-gray-500 shrink-0" style={{ width: 120 }}>Tên công ty:</span>
                                    <span className="text-white font-bold text-base">
                                        CÔNG TY CỔ PHẦN ỨNG DỤNG PHÁT TRIỂN CÔNG NGHỆ VÀ KHOA HỌC VIỆT NAM
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 shrink-0" style={{ width: 120 }}>Địa chỉ trụ sở:</span>
                                    <span>Số nhà 35 ngõ 451 đường Hoàng Tăng Bí, Thành phố Hà Nội</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 shrink-0" style={{ width: 120 }}>Hotline:</span>
                                    <span>0383634255</span>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="flex flex-col md:items-end">
                            <div className="w-fit">
                                <Title level={5} className="!text-white !mb-4 text-left">Giới thiệu</Title>
                                <div className="flex flex-col gap-2">
                                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Về chúng tôi
                                    </Link>
                                    <Link to="/reviews" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Đánh giá của khách hàng
                                    </Link>
                                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Liên hệ
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Policies */}
                        <div className="flex flex-col md:items-end">
                            <div className="w-fit">
                                <Title level={5} className="!text-white !mb-4 text-left">Chính sách</Title>
                                <div className="flex flex-col gap-2">
                                    <Link to="/policy/warranty" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Chính sách bảo hành
                                    </Link>
                                    <Link to="/policy/return" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Chính sách đổi trả
                                    </Link>
                                    <Link to="/policy/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Chính sách bảo mật
                                    </Link>
                                    <Link to="/policy/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Chính sách vận chuyển
                                    </Link>
                                    <Link to="/policy/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Điều khoản sử dụng
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                        <Text className="text-gray-500">
                            © 2026 VINADATS.,JSC. Tất cả quyền được bảo lưu.
                        </Text>
                    </div>
                </div>
            </Footer>
            {/* AI Chatbot */}
            <AIChatBot />
        </Layout>
    )
}

export default PublicLayout
