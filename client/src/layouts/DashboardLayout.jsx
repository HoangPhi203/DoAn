import { useState, useEffect } from 'react'
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
        { key: '/receptionist/orders', icon: <FormOutlined />, label: 'Tiếp nhận đơn' },
        { key: '/receptionist/customers', icon: <FileTextOutlined />, label: 'Báo giá & Hóa đơn' },
        { key: '/receptionist/appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
        { key: '/receptionist/tasks', icon: <UnorderedListOutlined />, label: 'Danh sách công việc' },
        { key: '/receptionist/warranty', icon: <ToolOutlined />, label: 'Bảo hành' },
    ],
    technician: [
        { key: '/technician', icon: <DashboardOutlined />, label: 'Tổng quan' },
        { key: '/technician/tasks', icon: <UnorderedListOutlined />, label: 'Danh sách công việc' },
        { key: '/technician/inventory', icon: <InboxOutlined />, label: 'Yêu cầu linh kiện' },
    ],
    admin: [
        { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan' },
        { type: 'divider' },
        { key: 'group-reception', type: 'group', label: 'Tiếp nhận & Khách hàng' },
        { key: '/admin/orders', icon: <FormOutlined />, label: 'Tiếp nhận đơn' },
        { key: '/admin/appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
        { key: '/admin/quotes', icon: <FileTextOutlined />, label: 'Báo giá & Hóa đơn' },
        { type: 'divider' },
        { key: 'group-tech', type: 'group', label: 'Kỹ thuật & Sửa chữa' },
        { key: '/admin/tasks', icon: <UnorderedListOutlined />, label: 'Danh sách công việc' },
        { key: '/admin/parts', icon: <InboxOutlined />, label: 'Yêu cầu linh kiện' },
        { type: 'divider' },
        { key: 'group-system', type: 'group', label: 'Quản trị hệ thống' },
        { key: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
        { key: '/admin/inventory', icon: <AppstoreOutlined />, label: 'Quản lý kho' },
        { key: '/admin/warranty', icon: <ToolOutlined />, label: 'Quản lý bảo hành' },
        { key: '/admin/reports', icon: <BarChartOutlined />, label: 'Báo cáo thống kê' },
    ],
}

const roleTitles = {
    receptionist: 'Tiếp tân',
    technician: 'Kỹ thuật viên',
    admin: 'Quản trị',
}

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const role = user?.role || 'customer'

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
            onClick: () => navigate(`/${role === 'admin' ? 'admin' : role === 'receptionist' ? 'receptionist' : 'technician'}/profile`),
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

    const basePath = role === 'admin' ? '/admin' : role === 'receptionist' ? '/receptionist' : '/technician'

    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const res = await fetch('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setNotifications(data.data)
                setUnreadCount(data.unreadCount)
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err)
        }
    }

    useEffect(() => {
        if (user) {
            fetchNotifications()
            const interval = setInterval(fetchNotifications, 60000) // Check every minute
            return () => clearInterval(interval)
        }
    }, [user])

    const handleNotificationClick = async (n) => {
        // Mark as read
        if (!n.daDoc) {
            try {
                const token = localStorage.getItem('token')
                await fetch(`http://localhost:5000/api/notifications/${n._id}/read`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` }
                })
                fetchNotifications() // refresh count
            } catch (err) {
                console.error(err)
            }
        }

        // Navigate based on type
        if (n.loai === 'LichHen') {
            navigate(`${basePath}/appointments`)
        } else if (n.loai === 'DonHang') {
            navigate(`${basePath}/orders`)
        }
    }

    const getIconForType = (type) => {
        switch (type) {
            case 'LichHen': return <CalendarOutlined className="text-purple-500" />
            case 'DonHang': return <FormOutlined className="text-blue-500" />
            case 'BaoGia': return <FileTextOutlined className="text-green-500" />
            default: return <BellOutlined className="text-gray-500" />
        }
    }

    function timeAgo(dateParam) {
        if (!dateParam) {
            return null;
        }

        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const today = new Date();
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();

        if (seconds < 5) return 'Vừa xong';
        else if (seconds < 60) return `${seconds} giây trước`;
        else if (seconds < 90) return '1 phút trước';
        else if (minutes < 60) return `${minutes} phút trước`;
        else if (isToday) return `${Math.round(minutes / 60)} giờ trước`;

        return date.toLocaleDateString('vi-VN');
    }

    const notificationMenu = {
        items: [
            ...notifications.map(n => ({
                key: n._id,
                label: (
                    <div className="py-1.5 flex items-start gap-3 min-w-[280px]" onClick={() => handleNotificationClick(n)}>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {getIconForType(n.loai)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm ${!n.daDoc ? 'text-gray-900' : 'text-gray-500'}`}>{n.tieuDe}</div>
                            <div className="text-xs text-gray-500 break-words line-clamp-2" style={{ whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.noiDung}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</div>
                        </div>
                        {!n.daDoc && <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>}
                    </div>
                ),
            })),
            { type: 'divider' },
            {
                key: 'view-all',
                label: (
                    <div className="text-center text-primary-600 font-medium text-sm py-1" onClick={() => navigate(basePath)}>
                        Xem tất cả thông báo
                    </div>
                ),
            },
        ],
    }

    const SideMenu = ({ mode = 'inline' }) => (
        <Menu
            mode={mode}
            selectedKeys={[location.pathname]}
            items={menuItems.map((item, idx) => {
                if (item.type === 'divider') {
                    return { type: 'divider', key: `divider-${idx}` }
                }
                if (item.type === 'group') {
                    return { type: 'group', label: item.label, key: item.key }
                }
                return {
                    ...item,
                    label: <Link to={item.key}>{item.label}</Link>,
                }
            })}
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
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-100 flex-shrink-0">
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

                {/* Menu - Scrollable */}
                <div className="flex-1 overflow-y-auto py-4 px-2" style={{ overflowX: 'hidden' }}>
                    <SideMenu />
                </div>

                {/* User Card at Bottom - Fixed */}
                {!collapsed && (
                    <div className="flex-shrink-0 p-4 border-t border-gray-100">
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
                            <Badge count={unreadCount} size="small">
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
