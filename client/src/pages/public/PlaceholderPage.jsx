import { Card, Typography, Button, Result } from 'antd'
import { RocketOutlined, HomeOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'

const { Title, Paragraph } = Typography

const PlaceholderPage = () => {
    const location = useLocation()
    const pathName = location.pathname.split('/').filter(Boolean).pop()
    const displayTitle = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Trang Đang Phát Triển'

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
            <Card className="shadow-lg border-0 max-w-2xl w-full text-center py-12" style={{ borderRadius: 16 }}>
                <Result
                    icon={<RocketOutlined className="text-primary-500 text-6xl drop-shadow-md" />}
                    title={<Title level={3} className="!mb-4">Chức năng {displayTitle}</Title>}
                    subTitle={
                        <Paragraph className="text-gray-500 text-base mb-8">
                            Giao diện đang trong quá trình hoàn thiện. Xin vui lòng quay lại sau!
                        </Paragraph>
                    }
                    extra={
                        <Link to="/">
                            <Button type="primary" size="large" icon={<HomeOutlined />} className="px-8 h-12 rounded-lg shadow-glow gradient-primary border-0">
                                Trở về Trang chủ
                            </Button>
                        </Link>
                    }
                />
            </Card>
        </div>
    )
}

export default PlaceholderPage
