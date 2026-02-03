import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Badge, Drawer } from 'antd'
import {
    DashboardOutlined,
    FormOutlined,
    FileTextOutlined,
    CalendarOutlined,
    ToolOutlined,
    UnorderedListOutlined,
    InboxOutlined,
    TeamOutlined,
    BarChartOutlined,
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import { roleLabels } from '../data/mockUsers'

const { Header, Sider, Content } = Layout
const { Text, Title } = Typography

// Menu items based on role
const menuConfig = {
    receptionist: [
        { key: '/receptionist', icon: <DashboardOutlined />, label: 'Tổng quan' },
        { key: '/receptionist/order-intake', icon: <FormOutlined />, label: 'Tiếp nhận đơn' },
        { key: '/receptionist/quotes', icon: <FileTextOutlined />, label: 'Báo giá & Hóa đơn' },
        { key: '/receptionist/appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
    ],
    technician: [
        { key: '/technician', icon: <DashboardOutlined />, label: 'Tổng quan' },
        { key: '/technician/work-list', icon: <UnorderedListOutlined />, label: 'Danh sách công việc' },
        { key: '/technician/parts-request', icon: <InboxOutlined />, label: 'Yêu cầu linh kiện' },
    ],
    admin: [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan' },
        { key: '/admin/inventory', icon: <AppstoreOutlined />, label: 'Quản lý kho' },
        { key: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
        { key: '/admin/reports', icon: <BarChartOutlined />, label: 'Báo cáo thống kê' },
    ],
}

const roleTitles = {
    receptionist: 'Tiếp tân',
    technician: 'Kỹ thuật viên',
    admin: 'Quản trị',
}

const DashboardLayout = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const menuItems = menuConfig[role] || []

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ cá nhân',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
        {
            type: 'divider',
        },
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Về trang chủ',
            onClick: () => navigate('/'),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: handleLogout,
        },
    ]

    const notifications = [
        { id: 1, title: 'Đơn mới #ORD-2024-007', time: '5 phút trước' },
        { id: 2, title: 'Khách xác nhận báo giá', time: '15 phút trước' },
        { id: 3, title: 'Linh kiện về kho', time: '1 giờ trước' },
    ]

    const notificationMenu = {
        items: notifications.map(n => ({
            key: n.id,
            label: (
                <div className="py-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-gray-500">{n.time}</div>
                </div>
            ),
        })),
    }

    const SideMenu = ({ mode = 'inline' }) => (
        <Menu
            mode={mode}
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({
                ...item,
                label: <Link to={item.key}>{item.label}</Link>,
            }))}
            className="border-none"
            style={{ background: 'transparent' }}
        />
    )

    return (
        <Layout className="min-h-screen">
            {/* Desktop Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                className="hidden md:block fixed left-0 top-0 bottom-0 z-40"
                style={{
                    background: '#fff',
                    borderRight: '1px solid var(--color-border)',
                    overflow: 'auto',
                }}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                            <ToolOutlined className="text-white text-lg" />
                        </div>
                        {!collapsed && (
                            <div>
                                <Title level={5} className="!mb-0 !text-base gradient-text">
                                    LaptopCare
                                </Title>
                                <Text className="text-[10px] text-gray-400 leading-none">
                                    {roleTitles[role]}
                                </Text>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Menu */}
                <div className="py-4 px-2">
                    <SideMenu />
                </div>

                {/* User Card at Bottom */}
                {!collapsed && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Avatar
                                size={40}
                                icon={<UserOutlined />}
                                className="bg-primary-600 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">{user?.name}</div>
                                <div className="text-xs text-gray-500">{roleLabels[user?.role]}</div>
                            </div>
                        </div>
                    </div>
                )}
            </Sider>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <ToolOutlined className="text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-base">LaptopCare</div>
                            <div className="text-xs text-gray-500">{roleTitles[role]}</div>
                        </div>
                    </div>
                }
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
                className="md:hidden"
            >
                <SideMenu />

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                        <Avatar icon={<UserOutlined />} className="bg-primary-600" />
                        <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{user?.name}</div>
                            <div className="text-xs text-gray-500">{roleLabels[user?.role]}</div>
                        </div>
                    </div>
                    <Button
                        block
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </Drawer>

            {/* Main Layout */}
            <Layout className={`transition-all duration-300 ${collapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'}`}>
                {/* Header */}
                <Header
                    className="sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between"
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid var(--color-border)',
                        height: 64,
                        padding: '0 16px',
                    }}
                >
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <Button
                            type="text"
                            icon={<MenuFoldOutlined className="text-lg" />}
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden"
                        />

                        {/* Desktop Collapse Toggle */}
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:flex"
                        />

                        <div className="hidden sm:block">
                            <Text className="text-gray-500">Xin chào,</Text>
                            <Text className="font-semibold ml-1">{user?.name?.split(' ').pop()}</Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Dropdown menu={notificationMenu} placement="bottomRight" trigger={['click']}>
                            <Badge count={3} size="small">
                                <Button
                                    type="text"
                                    icon={<BellOutlined className="text-lg" />}
                                    className="flex items-center justify-center"
                                />
                            </Badge>
                        </Dropdown>

                        {/* User Menu */}
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-colors">
                                <Avatar
                                    size={36}
                                    icon={<UserOutlined />}
                                    className="bg-primary-600"
                                />
                                <div className="hidden sm:block text-left">
                                    <div className="text-sm font-medium leading-tight">{user?.name?.split(' ').slice(-2).join(' ')}</div>
                                    <div className="text-xs text-gray-500">{roleLabels[user?.role]}</div>
                                </div>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                {/* Content */}
                <Content className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default DashboardLayout
