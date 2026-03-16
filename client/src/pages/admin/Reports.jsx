import { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col, Typography, Select, Button, Table, Tag, Spin, Statistic, Space, message } from 'antd'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js'
import { DownloadOutlined, WarningOutlined, ReloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons'

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend, ArcElement, PointElement, LineElement)

const { Title, Text } = Typography
const { Option } = Select

const API_BASE = 'http://localhost:5000/api'

const Reports = () => {
    const [year, setYear] = useState(new Date().getFullYear())
    const [loading, setLoading] = useState(false)
    const [revenueData, setRevenueData] = useState(null)
    const [statusData, setStatusData] = useState(null)
    const [performanceData, setPerformanceData] = useState(null)
    const [lowStock, setLowStock] = useState([])
    const [exportingExcel, setExportingExcel] = useState(false)
    const [exportingPdf, setExportingPdf] = useState(false)

    const getToken = () => localStorage.getItem('token')

    const fetchHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }), [])

    // Lấy dữ liệu doanh thu
    const fetchRevenue = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/revenue?year=${year}`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success) {
                const months = data.data.chiTietThang
                setRevenueData({
                    labels: months.map(m => `T${m.thang}`),
                    datasets: [{
                        label: 'Doanh thu (VNĐ)',
                        data: months.map(m => m.tongDoanhThu),
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    }],
                    totalYear: data.data.tongDoanhThuNam
                })
            }
        } catch {
            // Fallback to empty
        }
    }, [year, fetchHeaders])

    // Lấy thống kê trạng thái
    const fetchOrderStatus = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/order-status`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success) {
                const statusColors = {
                    'Chờ báo giá': '#a855f7',
                    'Chờ khách duyệt': '#f97316',
                    'Đang sửa': '#3b82f6',
                    'Chờ linh kiện': '#eab308',
                    'Hoàn thành': '#10b981',
                    'Đã trả khách': '#06b6d4'
                }

                const details = data.data.chiTiet
                setStatusData({
                    labels: details.map(d => d.nhanMac),
                    datasets: [{
                        data: details.map(d => d.soLuong),
                        backgroundColor: details.map(d => statusColors[d.nhanMac] || '#9ca3af'),
                        borderWidth: 0
                    }],
                    total: data.data.tongDon
                })
            }
        } catch {
            // Fallback
        }
    }, [fetchHeaders])

    // Lấy hiệu suất KTV
    const fetchPerformance = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/technician-performance?year=${year}`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success && data.data.length > 0) {
                const colors = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#ef4444', '#06b6d4']
                setPerformanceData({
                    raw: data.data,
                    chartData: {
                        labels: data.data.map(d => d.hoTen),
                        datasets: [
                            {
                                label: 'Hoàn thành',
                                data: data.data.map(d => d.donHoanThanh),
                                backgroundColor: '#10b981',
                                borderRadius: 4
                            },
                            {
                                label: 'Đang sửa',
                                data: data.data.map(d => d.donDangSua),
                                backgroundColor: '#3b82f6',
                                borderRadius: 4
                            },
                            {
                                label: 'Chờ linh kiện',
                                data: data.data.map(d => d.donChoLinhKien),
                                backgroundColor: '#f97316',
                                borderRadius: 4
                            }
                        ]
                    }
                })
            }
        } catch {
            // Fallback
        }
    }, [year, fetchHeaders])

    // Lấy cảnh báo tồn kho
    const fetchLowStock = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/low-stock`, { headers: fetchHeaders() })
            const data = await res.json()
            if (data.success) {
                setLowStock(data.data)
            }
        } catch {
            // Fallback
        }
    }, [fetchHeaders])

    const fetchAll = useCallback(async () => {
        setLoading(true)
        await Promise.all([fetchRevenue(), fetchOrderStatus(), fetchPerformance(), fetchLowStock()])
        setLoading(false)
    }, [fetchRevenue, fetchOrderStatus, fetchPerformance, fetchLowStock])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    // Xuất Excel
    const handleExportExcel = async () => {
        setExportingExcel(true)
        try {
            const res = await fetch(`${API_BASE}/reports/export/excel?year=${year}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `BaoCaoDoanhThu_${year}.xlsx`
                a.click()
                window.URL.revokeObjectURL(url)
                message.success('Đã tải file Excel')
            } else {
                message.error('Lỗi khi xuất Excel')
            }
        } catch {
            message.error('Lỗi khi xuất Excel')
        } finally {
            setExportingExcel(false)
        }
    }

    // Xuất PDF
    const handleExportPdf = async () => {
        setExportingPdf(true)
        try {
            const res = await fetch(`${API_BASE}/reports/export/pdf?year=${year}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            })
            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `BaoCao_${year}.pdf`
                a.click()
                window.URL.revokeObjectURL(url)
                message.success('Đã tải file PDF')
            } else {
                message.error('Lỗi khi xuất PDF')
            }
        } catch {
            message.error('Lỗi khi xuất PDF')
        } finally {
            setExportingPdf(false)
        }
    }

    const lowStockColumns = [
        { title: 'Mã SKU', dataIndex: 'maSKU', key: 'maSKU', render: t => <span className="font-mono">{t}</span> },
        { title: 'Tên linh kiện', dataIndex: 'tenLinhKien', key: 'tenLinhKien' },
        { title: 'Danh mục', dataIndex: 'danhMuc', key: 'danhMuc' },
        { title: 'Tồn kho', dataIndex: 'soLuongTon', key: 'soLuongTon', render: (v, r) => <span className={v === 0 ? 'text-red-600 font-bold' : 'text-orange-500 font-semibold'}>{v}</span> },
        { title: 'Tồn tối thiểu', dataIndex: 'tonToiThieu', key: 'tonToiThieu' },
        {
            title: 'Mức', dataIndex: 'mucCanhBao', key: 'mucCanhBao',
            render: v => <Tag color={v === 'HetHang' ? 'red' : 'orange'}>{v === 'HetHang' ? 'Hết hàng' : 'Sắp hết'}</Tag>
        },
    ]

    if (loading) {
        return <div className="flex justify-center items-center py-20"><Spin size="large" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <Title level={4} className="!mb-0">Báo cáo & Thống kê</Title>
                <Space>
                    <Select value={year} onChange={setYear} className="w-32">
                        {[2026, 2025, 2024].map(y => <Option key={y} value={y}>Năm {y}</Option>)}
                    </Select>
                    <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} loading={exportingExcel} style={{ color: '#16a34a', borderColor: '#16a34a' }}>
                        Xuất Excel
                    </Button>
                    <Button icon={<FilePdfOutlined />} onClick={handleExportPdf} loading={exportingPdf} style={{ color: '#dc2626', borderColor: '#dc2626' }}>
                        Xuất PDF
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchAll}>Làm mới</Button>
                </Space>
            </div>

            {/* Thống kê tổng quan */}
            <Row gutter={[16, 16]}>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Tổng doanh thu năm" value={revenueData?.totalYear || 0} suffix="đ"
                            valueStyle={{ color: '#3b82f6' }}
                            formatter={v => v.toLocaleString('vi-VN')} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="Tổng đơn hàng" value={statusData?.total || 0} valueStyle={{ color: '#10b981' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="KTV hoạt động" value={performanceData?.raw?.length || 0} valueStyle={{ color: '#a855f7' }} />
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Statistic title="LK sắp hết" value={lowStock.length} valueStyle={{ color: lowStock.length > 0 ? '#ef4444' : '#10b981' }}
                            prefix={lowStock.length > 0 ? <WarningOutlined /> : null} />
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ doanh thu + trạng thái */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Doanh thu theo tháng" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        {revenueData ? (
                            <Bar data={revenueData} options={{
                                responsive: true,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: {
                                        ticks: {
                                            callback: v => v >= 1000000 ? `${(v / 1000000).toFixed(0)}tr` : v.toLocaleString()
                                        }
                                    }
                                }
                            }} />
                        ) : (
                            <div className="text-center py-8 text-gray-400">Chưa có dữ liệu doanh thu</div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Trạng thái đơn hàng" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        {statusData ? (
                            <Doughnut data={statusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                        ) : (
                            <div className="text-center py-8 text-gray-400">Chưa có dữ liệu</div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Hiệu suất KTV */}
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Card title="Hiệu suất kỹ thuật viên" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        {performanceData?.chartData ? (
                            <Bar data={performanceData.chartData} options={{
                                responsive: true,
                                plugins: { legend: { position: 'top' } },
                                scales: { x: { stacked: true }, y: { stacked: true } }
                            }} />
                        ) : (
                            <div className="text-center py-8 text-gray-400">Chưa có dữ liệu hiệu suất</div>
                        )}
                        {performanceData?.raw && (
                            <Table
                                className="mt-4"
                                dataSource={performanceData.raw}
                                rowKey="_id"
                                size="small"
                                pagination={false}
                                columns={[
                                    { title: 'KTV', dataIndex: 'hoTen' },
                                    { title: 'Tổng đơn', dataIndex: 'tongDon' },
                                    { title: 'Hoàn thành', dataIndex: 'donHoanThanh', render: v => <span className="text-green-600 font-semibold">{v}</span> },
                                    { title: 'Đang sửa', dataIndex: 'donDangSua', render: v => <span className="text-blue-600">{v}</span> },
                                    { title: 'Chờ LK', dataIndex: 'donChoLinhKien', render: v => <span className="text-orange-500">{v}</span> },
                                    {
                                        title: 'Tỷ lệ HT',
                                        dataIndex: 'tyLeHoanThanh',
                                        render: v => <Tag color={v >= 80 ? 'green' : v >= 50 ? 'orange' : 'red'}>{v.toFixed(1)}%</Tag>
                                    },
                                ]}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Cảnh báo tồn kho */}
            {lowStock.length > 0 && (
                <Card
                    title={<span><WarningOutlined className="text-red-500 mr-2" />Cảnh báo linh kiện tồn kho ({lowStock.length})</span>}
                    className="shadow-sm border-0"
                    style={{ borderRadius: 12 }}
                >
                    <Table columns={lowStockColumns} dataSource={lowStock} rowKey="_id" size="small" pagination={{ pageSize: 10 }} />
                </Card>
            )}
        </div>
    )
}

export default Reports
