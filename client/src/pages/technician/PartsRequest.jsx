import { useState } from 'react'
import { Card, Input, Table, Button, Tag, InputNumber, Typography, Badge, message } from 'antd'
import { SearchOutlined, ShoppingCartOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons'
import { mockInventory } from '../../data/mockInventory'

const { Title, Text } = Typography

const PartsRequest = () => {
    const [searchText, setSearchText] = useState('')
    const [cart, setCart] = useState([])

    const filteredParts = mockInventory.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchText.toLowerCase())
    )

    const addToCart = (part) => {
        const existing = cart.find(c => c.id === part.id)
        if (existing) {
            setCart(cart.map(c => c.id === part.id ? { ...c, quantity: c.quantity + 1 } : c))
        } else {
            setCart([...cart, { ...part, quantity: 1 }])
        }
        message.success(`Đã thêm ${part.name}`)
    }

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            setCart(cart.filter(c => c.id !== id))
        } else {
            setCart(cart.map(c => c.id === id ? { ...c, quantity } : c))
        }
    }

    const handleSubmitRequest = () => {
        if (cart.length === 0) {
            message.warning('Chưa có linh kiện trong giỏ')
            return
        }
        message.success('Đã gửi yêu cầu linh kiện!')
        setCart([])
    }

    const columns = [
        { title: 'SKU', dataIndex: 'sku', key: 'sku', render: text => <span className="font-mono text-sm">{text}</span> },
        { title: 'Tên linh kiện', dataIndex: 'name', key: 'name' },
        { title: 'Danh mục', dataIndex: 'category', key: 'category' },
        { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity', render: (qty, r) => <Tag color={r.isLowStock ? 'red' : 'green'}>{qty}</Tag> },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: p => `${p.toLocaleString('vi-VN')}đ` },
        { title: '', key: 'action', render: (_, r) => <Button type="primary" size="small" disabled={r.quantity === 0} onClick={() => addToCart(r)}>Thêm</Button> },
    ]

    return (
        <div className="space-y-6">
            <Title level={4}>Yêu cầu linh kiện</Title>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        <Input size="large" placeholder="Tìm theo tên hoặc SKU..." prefix={<SearchOutlined />} value={searchText} onChange={e => setSearchText(e.target.value)} className="mb-4" />
                        <Table columns={columns} dataSource={filteredParts} rowKey="id" pagination={{ pageSize: 8 }} size="small" />
                    </Card>
                </div>

                <div>
                    <Card title={<span><ShoppingCartOutlined className="mr-2" />Giỏ yêu cầu <Badge count={cart.length} /></span>} className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                        {cart.length === 0 ? (
                            <Text className="text-gray-400">Chưa có linh kiện</Text>
                        ) : (
                            <div className="space-y-3">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.sku}</div>
                                        </div>
                                        <InputNumber min={0} max={item.quantity} value={item.quantity} size="small" className="w-16" onChange={val => updateQuantity(item.id, val)} />
                                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => updateQuantity(item.id, 0)} />
                                    </div>
                                ))}
                                <Button type="primary" block icon={<SendOutlined />} onClick={handleSubmitRequest}>Gửi yêu cầu</Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PartsRequest
