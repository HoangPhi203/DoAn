// Mock Appointments Data - Hệ thống Quản lý Sửa chữa Laptop

export const appointmentStatuses = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
}

export const appointmentStatusLabels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
    no_show: 'Không đến',
}

export const appointmentStatusColors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    completed: '#10b981',
    cancelled: '#ef4444',
    no_show: '#6b7280',
}

export const mockAppointments = [
    {
        id: 'APT-001',
        customer: {
            name: 'Nguyễn Văn An',
            phone: '0901111222',
            email: 'nguyenvanan@gmail.com',
        },
        date: '2024-02-05',
        time: '09:00',
        deviceType: 'Laptop Dell XPS 13',
        issueDescription: 'Laptop không lên nguồn, đèn LED không sáng',
        status: 'confirmed',
        notes: 'Khách đã gọi xác nhận sẽ đến đúng giờ',
        createdAt: '2024-02-01T10:30:00',
    },
    {
        id: 'APT-002',
        customer: {
            name: 'Trần Thị Bình',
            phone: '0902222333',
            email: 'tranthibibh@gmail.com',
        },
        date: '2024-02-05',
        time: '10:30',
        deviceType: 'MacBook Air M1',
        issueDescription: 'Màn hình bị ám vàng một góc',
        status: 'pending',
        notes: '',
        createdAt: '2024-02-02T14:00:00',
    },
    {
        id: 'APT-003',
        customer: {
            name: 'Lê Minh Cường',
            phone: '0903333444',
            email: 'leminhcuong@gmail.com',
        },
        date: '2024-02-05',
        time: '14:00',
        deviceType: 'Laptop Asus Vivobook',
        issueDescription: 'Bàn phím bị liệt một số phím, có nước đổ vào tuần trước',
        status: 'confirmed',
        notes: 'Có thể cần thay bàn phím, chuẩn bị báo giá trước',
        createdAt: '2024-02-03T08:00:00',
    },
    {
        id: 'APT-004',
        customer: {
            name: 'Phạm Hoàng Dung',
            phone: '0904444555',
            email: 'phamhoangdung@gmail.com',
        },
        date: '2024-02-06',
        time: '09:30',
        deviceType: 'Laptop HP Probook',
        issueDescription: 'Pin sạc không vào, laptop chỉ chạy khi cắm sạc',
        status: 'pending',
        notes: '',
        createdAt: '2024-02-03T09:30:00',
    },
    {
        id: 'APT-005',
        customer: {
            name: 'Hoàng Văn Em',
            phone: '0905555666',
            email: 'hoangvanem@gmail.com',
        },
        date: '2024-02-04',
        time: '15:00',
        deviceType: 'Laptop Lenovo Legion',
        issueDescription: 'Muốn nâng cấp RAM và SSD',
        status: 'completed',
        notes: 'Đã tư vấn và lên đơn ORD-2024-007',
        createdAt: '2024-02-01T16:00:00',
    },
    {
        id: 'APT-006',
        customer: {
            name: 'Ngô Thị Phương',
            phone: '0906666777',
            email: 'ngothiphuong@gmail.com',
        },
        date: '2024-02-04',
        time: '11:00',
        deviceType: 'MacBook Pro 16"',
        issueDescription: 'Loa bị rè, có tiếng ù khi phát nhạc',
        status: 'cancelled',
        notes: 'Khách báo hủy vì bận công việc',
        createdAt: '2024-02-02T11:00:00',
    },
]

export const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00',
]

export default mockAppointments
