// Mock Users Data - Hệ thống Quản lý Sửa chữa Laptop

export const mockUsers = [
    // Admin
    {
        id: 'admin_001',
        name: 'Nguyễn Văn Admin',
        phone: '0901234567',
        email: 'admin@laptopcare.vn',
        password: 'admin123',
        role: 'admin',
        avatar: null,
        createdAt: '2024-01-01',
    },
    // Receptionists
    {
        id: 'rec_001',
        name: 'Trần Thị Tiếp Tân',
        phone: '0912345678',
        email: 'tieptan1@laptopcare.vn',
        password: 'tieptan123',
        role: 'receptionist',
        avatar: null,
        createdAt: '2024-01-15',
    },
    {
        id: 'rec_002',
        name: 'Lê Văn Hòa',
        phone: '0923456789',
        email: 'tieptan2@laptopcare.vn',
        password: 'tieptan123',
        role: 'receptionist',
        avatar: null,
        createdAt: '2024-02-01',
    },
    // Technicians
    {
        id: 'tech_001',
        name: 'Phạm Minh Kỹ Thuật',
        phone: '0934567890',
        email: 'kythuat1@laptopcare.vn',
        password: 'kythuat123',
        role: 'technician',
        avatar: null,
        createdAt: '2024-01-10',
    },
    {
        id: 'tech_002',
        name: 'Hoàng Văn Đức',
        phone: '0945678901',
        email: 'kythuat2@laptopcare.vn',
        password: 'kythuat123',
        role: 'technician',
        avatar: null,
        createdAt: '2024-01-20',
    },
    {
        id: 'tech_003',
        name: 'Võ Thanh Tùng',
        phone: '0956789012',
        email: 'kythuat3@laptopcare.vn',
        password: 'kythuat123',
        role: 'technician',
        avatar: null,
        createdAt: '2024-02-15',
    },
    // Customers
    {
        id: 'cust_001',
        name: 'Nguyễn Thị Khách Hàng',
        phone: '0967890123',
        email: 'khachhang1@gmail.com',
        password: 'khach123',
        role: 'customer',
        avatar: null,
        createdAt: '2024-03-01',
    },
    {
        id: 'cust_002',
        name: 'Trương Văn Minh',
        phone: '0978901234',
        email: 'khachhang2@gmail.com',
        password: 'khach123',
        role: 'customer',
        avatar: null,
        createdAt: '2024-03-15',
    },
]

// Role labels in Vietnamese
export const roleLabels = {
    admin: 'Quản trị viên',
    receptionist: 'Tiếp tân',
    technician: 'Kỹ thuật viên',
    customer: 'Khách hàng',
}

// Role colors for UI
export const roleColors = {
    admin: '#ef4444',
    receptionist: '#3b82f6',
    technician: '#10b981',
    customer: '#8b5cf6',
}

export default mockUsers
