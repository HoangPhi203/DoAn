import { Card, Row, Col, Typography, Select } from 'antd'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend, ArcElement, PointElement, LineElement)

const { Title } = Typography
const { Option } = Select

const Reports = () => {
    const revenueData = {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{ label: 'Doanh thu (triệu đồng)', data: [45, 52, 38, 65, 72, 80, 68, 75, 82, 90, 85, 95], backgroundColor: '#3b82f6', borderRadius: 6 }],
    }

    const statusData = {
        labels: ['Hoàn thành', 'Đang sửa', 'Chờ linh kiện', 'Chờ báo giá'],
        datasets: [{ data: [45, 25, 15, 15], backgroundColor: ['#10b981', '#3b82f6', '#f97316', '#a855f7'], borderWidth: 0 }],
    }

    const performanceData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        datasets: [
            { label: 'KTV A', data: [12, 15, 10, 18], borderColor: '#3b82f6', tension: 0.4 },
            { label: 'KTV B', data: [8, 12, 14, 11], borderColor: '#10b981', tension: 0.4 },
            { label: 'KTV C', data: [10, 9, 16, 14], borderColor: '#f97316', tension: 0.4 },
        ],
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={4} className="!mb-0">Báo cáo & Thống kê</Title>
                <Select defaultValue="2024" className="w-32">
                    <Option value="2024">Năm 2024</Option>
                    <Option value="2023">Năm 2023</Option>
                </Select>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Doanh thu theo tháng" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Trạng thái đơn hàng" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Doughnut data={statusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Card title="Hiệu suất kỹ thuật viên (đơn/tuần)" className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Line data={performanceData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Reports
