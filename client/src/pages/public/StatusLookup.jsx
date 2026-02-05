import { useState } from 'react'
import { Card, Input, Button, Typography, Timeline, Tag, Empty, Spin, Divider, Row, Col } from 'antd'
import {
    SearchOutlined,
    PhoneOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ToolOutlined,
    TruckOutlined,
    ExclamationCircleOutlined,
    LaptopOutlined,
} from '@ant-design/icons'
import { mockOrders, statusLabels, statusColors } from '../../data/mockOrders'

const { Title, Text, Paragraph } = Typography

const StatusLookup = () => {
    const [searchValue, setSearchValue] = useState('')
    const [searchType, setSearchType] = useState('tracking')
    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResult] = useState(null)
    const [error, setError] = useState('')

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setError('Vui lòng nhập mã vận đơn hoặc số điện thoại')
            return
        }

        setError('')
        setLoading(true)
        setSearchResult(null)

        await new Promise(resolve => setTimeout(resolve, 1000))

        let result = null
        if (searchType === 'tracking') {
            result = mockOrders.find(
                order => order.trackingCode.toLowerCase() === searchValue.toLowerCase() ||
                    order.id.toLowerCase() === searchValue.toLowerCase()
            )
        } else {
            result = mockOrders.find(
                order => order.customer.phone === searchValue.replace(/\s/g, '')
            )
        }

        if (result) {
            setSearchResult(result)
        } else {
            setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.')
        }

        setLoading(false)
    }

    const getStatusIcon = (status) => {
        const icons = {
            pending_quote: <ClockCircleOutlined />,
            quoted: <FileTextOutlined />,
            confirmed: <CheckCircleOutlined />,
            diagnosing: <SearchOutlined />,
            repairing: <ToolOutlined />,
            waiting_parts: <ExclamationCircleOutlined />,
            completed: <CheckCircleOutlined />,
            delivered: <TruckOutlined />,
            cancelled: <ExclamationCircleOutlined />,
        }
        return icons[status] || <ClockCircleOutlined />
    }

    const getTimelineItems = (order) => {
        const statusOrder = ['pending_quote', 'quoted', 'confirmed', 'diagnosing', 'repairing', 'waiting_parts', 'completed', 'delivered']
        const currentIndex = statusOrder.indexOf(order.status)

        return statusOrder
            .filter(status => {
                if (status === 'waiting_parts' && order.status !== 'waiting_parts') {
                    return currentIndex > statusOrder.indexOf(status)
                }
                return statusOrder.indexOf(status) <= currentIndex
            })
            .map(status => ({
                color: status === order.status ? statusColors[status] : '#10b981',
                dot: status === order.status ? getStatusIcon(status) : <CheckCircleOutlined />,
                children: (
                    <div className={status === order.status ? 'font-semibold' : 'text-gray-500'}>
                        {statusLabels[status]}
                        {status === order.status && (
                            <Tag color={statusColors[status]} className="ml-2">Hiện tại</Tag>
                        )}
                    </div>
                ),
            }))
    }

    return (
        <div className="min-h-[80vh] py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                        <SearchOutlined className="text-3xl text-white" />
                    </div>
                    <Title level={2} className="!mb-2">Tra cứu trạng thái đơn hàng</Title>
                    <Text className="text-lg text-gray-500">
                        Nhập mã vận đơn hoặc số điện thoại để xem tiến độ sửa chữa
                    </Text>
                </div>

                <Card className="shadow-lg border-0 mb-8" style={{ borderRadius: 16 }}>
                    <div className="p-2 md:p-4">
                        <div className="flex gap-2 mb-4">
                            <Button type={searchType === 'tracking' ? 'primary' : 'default'} icon={<FileTextOutlined />} onClick={() => setSearchType('tracking')} className="flex-1">Mã vận đơn</Button>
                            <Button type={searchType === 'phone' ? 'primary' : 'default'} icon={<PhoneOutlined />} onClick={() => setSearchType('phone')} className="flex-1">Số điện thoại</Button>
                        </div>

                        <div className="flex gap-3">
                            <Input size="large" placeholder={searchType === 'tracking' ? 'Nhập mã vận đơn (VD: LC240001)' : 'Nhập số điện thoại (VD: 0967890123)'} prefix={searchType === 'tracking' ? <FileTextOutlined /> : <PhoneOutlined />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onPressEnter={handleSearch} className="flex-1" />
                            <Button type="primary" size="large" icon={<SearchOutlined />} onClick={handleSearch} loading={loading} className="px-8">Tra cứu</Button>
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">{error}</div>}

                        <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <strong>Demo:</strong> Thử tra cứu với mã <code className="bg-blue-100 px-1 rounded">LC240001</code> hoặc số điện thoại <code className="bg-blue-100 px-1 rounded">0967890123</code>
                        </div>
                    </div>
                </Card>

                {loading && (
                    <div className="text-center py-12">
                        <Spin size="large" />
                        <div className="mt-4 text-gray-500">Đang tìm kiếm...</div>
                    </div>
                )}

                {searchResult && !loading && (
                    <div className="animate-fade-in">
                        <Card className="shadow-lg border-0" style={{ borderRadius: 16 }}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
                                        <LaptopOutlined className="text-2xl text-primary-600" />
                                    </div>
                                    <div>
                                        <Text className="text-gray-500 text-sm">Mã đơn hàng</Text>
                                        <Title level={4} className="!mb-0">{searchResult.trackingCode}</Title>
                                    </div>
                                </div>
                                <Tag color={statusColors[searchResult.status]} className="text-base px-4 py-1" icon={getStatusIcon(searchResult.status)}>{statusLabels[searchResult.status]}</Tag>
                            </div>

                            <Divider />

                            <Row gutter={[24, 16]}>
                                <Col xs={24} md={12}>
                                    <div className="space-y-4">
                                        <div><Text className="text-gray-500 text-sm">Khách hàng</Text><div className="font-medium">{searchResult.customer.name}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Thiết bị</Text><div className="font-medium">{searchResult.device.brand} {searchResult.device.model}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Serial/IMEI</Text><div className="font-medium font-mono">{searchResult.device.serial || 'N/A'}</div></div>
                                    </div>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div className="space-y-4">
                                        <div><Text className="text-gray-500 text-sm">Ngày tiếp nhận</Text><div className="font-medium">{new Date(searchResult.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
                                        <div><Text className="text-gray-500 text-sm">Dự kiến hoàn thành</Text><div className="font-medium">{searchResult.estimatedCompletion ? new Date(searchResult.estimatedCompletion).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Chưa xác định'}</div></div>
                                        {searchResult.quote && (<div><Text className="text-gray-500 text-sm">Chi phí dự kiến</Text><div className="font-bold text-primary-600 text-lg">{searchResult.quote.totalCost.toLocaleString('vi-VN')}đ</div></div>)}
                                    </div>
                                </Col>
                            </Row>

                            <Divider />

                            <div className="mb-6">
                                <Text className="text-gray-500 text-sm">Mô tả lỗi</Text>
                                <Paragraph className="!mb-0 mt-1 p-3 bg-gray-50 rounded-lg">{searchResult.issueDescription}</Paragraph>
                            </div>

                            <div>
                                <Title level={5} className="!mb-4">Tiến trình xử lý</Title>
                                <Timeline items={getTimelineItems(searchResult)} />
                            </div>

                            {searchResult.notes.length > 0 && (
                                <>
                                    <Divider />
                                    <div>
                                        <Title level={5} className="!mb-4">Ghi chú</Title>
                                        <div className="space-y-3">
                                            {searchResult.notes.map((note, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="text-sm">{note.text}</div>
                                                    <div className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString('vi-VN')}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>
                )}

                {!searchResult && !loading && !error && (
                    <div className="text-center py-12">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-gray-400">Nhập thông tin để tra cứu trạng thái đơn hàng</span>} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default StatusLookup
