import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Drawer, Space, Typography, Avatar, Dropdown } from 'antd'
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
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuth()

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: 'Trang chủ' },
        { key: '/status-lookup', icon: <SearchOutlined />, label: 'Tra cứu' },
        { key: '/book-appointment', icon: <CalendarOutlined />, label: 'Đặt lịch' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
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
            {/* Header */}
            <Header
                className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between"
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--color-border)',
                    height: 70,
                }}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 no-underline">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <ToolOutlined className="text-white text-xl" />
                    </div>
                    <div className="hidden sm:block">
                        <Title level={4} className="!mb-0 !text-lg gradient-text">
                            LaptopCare
                        </Title>
                        <Text className="text-xs text-gray-500">Sửa chữa chuyên nghiệp</Text>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[location.pathname]}
                        items={menuItems.map(item => ({
                            ...item,
                            label: <Link to={item.key}>{item.label}</Link>,
                        }))}
                        className="border-none bg-transparent"
                        style={{ minWidth: 300 }}
                    />
                </div>

                {/* Auth Buttons / User Menu */}
                <div className="hidden md:flex items-center gap-3">
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
                                <Button icon={<LoginOutlined />}>Đăng nhập</Button>
                            </Link>
                            <Link to="/register">
                                <Button type="primary" icon={<UserAddOutlined />}>
                                    Đăng ký
                                </Button>
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
            </Header>

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
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <UserAddOutlined />
                                <span>Đăng ký</span>
                            </Link>
                        </>
                    )}
                </div>
            </Drawer>

            {/* Main Content */}
            <Content className="mt-[70px]">
                <Outlet />
            </Content>

            {/* Footer */}
            <Footer className="bg-gray-900 text-white !p-0">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                    <ToolOutlined className="text-white text-xl" />
                                </div>
                                <Title level={4} className="!mb-0 !text-white">
                                    LaptopCare
                                </Title>
                            </div>
                            <Paragraph className="text-gray-400 max-w-sm">
                                Dịch vụ sửa chữa laptop chuyên nghiệp với đội ngũ kỹ thuật viên
                                giàu kinh nghiệm. Cam kết chất lượng, giá cả hợp lý.
                            </Paragraph>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <Title level={5} className="!text-white !mb-4">Liên kết nhanh</Title>
                            <div className="flex flex-col gap-2">
                                <Link to="/status-lookup" className="text-gray-400 hover:text-white transition-colors">
                                    Tra cứu đơn hàng
                                </Link>
                                <Link to="/book-appointment" className="text-gray-400 hover:text-white transition-colors">
                                    Đặt lịch hẹn
                                </Link>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <Title level={5} className="!text-white !mb-4">Liên hệ</Title>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <PhoneOutlined />
                                    <span>1900 1234 56</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MailOutlined />
                                    <span>support@laptopcare.vn</span>
                                </div>
                                <div className="flex items-start gap-2 text-gray-400">
                                    <EnvironmentOutlined className="mt-1" />
                                    <span>123 Nguyễn Văn Linh, Q.7, TP.HCM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                        <Text className="text-gray-500">
                            © 2024 LaptopCare. Tất cả quyền được bảo lưu.
                        </Text>
                    </div>
                </div>
            </Footer>
        </Layout>
    )
}

export default PublicLayout
