import { useState } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Typography, Space, message } from 'antd'
import { PlusOutlined, ImportOutlined, ExportOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { mockInventory } from '../../data/mockInventory'

const { Title } = Typography
const { Option } = Select

const InventoryManagement = () => {
    const [data, setData] = useState(mockInventory)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [form] = Form.useForm()

    const categories = ['RAM', 'SSD', 'HDD', 'Màn hình', 'Pin', 'Bàn phím', 'Sạc', 'Mainboard', 'Khác']

    const handleAdd = () => {
        setEditingItem(null)
        form.resetFields()
        setModalVisible(true)
    }

    const handleEdit = (record) => {
        setEditingItem(record)
        form.setFieldsValue(record)
        setModalVisible(true)
    }

    const handleDelete = (id) => {
        setData(data.filter(i => i.id !== id))
        message.success('Đã xóa linh kiện')
    }

    const handleSave = (values) => {
        if (editingItem) {
            setData(data.map(i => i.id === editingItem.id ? { ...i, ...values } : i))
            message.success('Đã cập nhật')
        } else {
            setData([...data, { ...values, id: `INV-${Date.now()}` }])
            message.success('Đã thêm linh kiện')
        }
        setModalVisible(false)
    }

    const columns = [
        { title: 'SKU', dataIndex: 'sku', key: 'sku', render: text => <span className="font-mono">{text}</span> },
        { title: 'Tên linh kiện', dataIndex: 'name', key: 'name' },
        { title: 'Danh mục', dataIndex: 'category', key: 'category' },
        { title: 'Tồn kho', dataIndex: 'quantity', key: 'quantity', render: (qty, r) => <Tag color={r.isLowStock ? 'red' : 'green'}>{qty}</Tag> },
        { title: 'Giá nhập', dataIndex: 'costPrice', key: 'costPrice', render: p => `${p?.toLocaleString('vi-VN') || 0}đ` },
        { title: 'Giá bán', dataIndex: 'price', key: 'price', render: p => `${p.toLocaleString('vi-VN')}đ` },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={4} className="!mb-0">Quản lý kho hàng</Title>
                <Space>
                    <Button icon={<ImportOutlined />}>Nhập kho</Button>
                    <Button icon={<ExportOutlined />}>Xuất Excel</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm linh kiện</Button>
                </Space>
            </div>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal title={editingItem ? 'Sửa linh kiện' : 'Thêm linh kiện'} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                        <Input placeholder="RAM-DDR4-8G" />
                    </Form.Item>
                    <Form.Item name="name" label="Tên linh kiện" rules={[{ required: true }]}>
                        <Input placeholder="RAM DDR4 8GB" />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                        <Select placeholder="Chọn danh mục">
                            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>
                    <Form.Item name="costPrice" label="Giá nhập">
                        <InputNumber min={0} className="w-full" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} addonAfter="đ" />
                    </Form.Item>
                    <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}>
                        <InputNumber min={0} className="w-full" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} addonAfter="đ" />
                    </Form.Item>
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default InventoryManagement
