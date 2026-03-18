import { useState, useEffect, useCallback } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Typography, Space, message, Popconfirm } from 'antd'
import { PlusOutlined, ImportOutlined, ExportOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select

const API_BASE = 'http://localhost:5000/api'

const InventoryManagement = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [importModalVisible, setImportModalVisible] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [importingItem, setImportingItem] = useState(null)
    const [form] = Form.useForm()
    const [importForm] = Form.useForm()

    const categories = ['RAM', 'SSD', 'HDD', 'Màn hình', 'Pin', 'Bàn phím', 'Sạc', 'Mainboard', 'Khác']

    const getToken = () => localStorage.getItem('token')

    const fetchHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }), [])

    const fetchInventory = useCallback(async () => {
        setLoading(true)
        try {
            // Using limit=100 for simplicity as we lack full frontend pagination implementation yet
            const res = await fetch(`${API_BASE}/inventory?limit=100`, { headers: fetchHeaders() })
            const responseData = await res.json()
            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            message.error('Không thể tải dữ liệu kho')
        } finally {
            setLoading(false)
        }
    }, [fetchHeaders])

    useEffect(() => {
        fetchInventory()
    }, [fetchInventory])

    const handleAdd = () => {
        setEditingItem(null)
        form.resetFields()
        setModalVisible(true)
    }

    const handleEdit = (record) => {
        setEditingItem(record)
        form.setFieldsValue({
            ...record,
            price: record.giaBan,
            costPrice: record.giaNhap,
            quantity: record.soLuongTon,
            name: record.tenLinhKien,
            category: record.danhMuc,
            sku: record.maSKU
        })
        setModalVisible(true)
    }

    const handleImport = (record) => {
        setImportingItem(record)
        importForm.resetFields()
        importForm.setFieldsValue({
            giaNhapMoi: record.giaNhap
        })
        setImportModalVisible(true)
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/inventory/${id}`, {
                method: 'DELETE',
                headers: fetchHeaders()
            })
            const responseData = await res.json()
            if (responseData.success) {
                message.success('Đã xóa linh kiện')
                fetchInventory()
            } else {
                message.error(responseData.message || 'Lỗi khi xóa linh kiện')
            }
        } catch (error) {
            message.error('Lỗi kết nối')
        }
    }

    const handleSave = async (values) => {
        const payload = {
            tenLinhKien: values.name,
            danhMuc: values.category,
            soLuongTon: values.quantity,
            giaNhap: values.costPrice || 0,
            giaBan: values.price || 0,
        }

        // maSKU is unique, only send it if we are creating or if editing, though update might not need it
        if (!editingItem && values.sku) {
            payload.maSKU = values.sku
        }

        try {
            const method = editingItem ? 'PUT' : 'POST'
            const url = editingItem ? `${API_BASE}/inventory/${editingItem._id}` : `${API_BASE}/inventory`
            
            const res = await fetch(url, {
                method,
                headers: fetchHeaders(),
                body: JSON.stringify(payload)
            })
            const responseData = await res.json()
            
            if (responseData.success) {
                message.success(editingItem ? 'Đã cập nhật linh kiện' : 'Đã thêm linh kiện mới')
                setModalVisible(false)
                fetchInventory()
            } else {
                message.error(responseData.message || 'Có lỗi xảy ra')
            }
        } catch (error) {
            message.error('Lỗi kết nối server')
        }
    }

    const handleSaveImport = async (values) => {
        try {
            const payload = {
                soLuong: values.soLuongNhap,
                giaNhap: values.giaNhapMoi
            }

            const res = await fetch(`${API_BASE}/inventory/${importingItem._id}/import`, {
                method: 'PUT',
                headers: fetchHeaders(),
                body: JSON.stringify(payload)
            })
            const responseData = await res.json()
            
            if (responseData.success) {
                message.success(`Đã nhập thêm ${values.soLuongNhap} sản phẩm`)
                setImportModalVisible(false)
                fetchInventory()
            } else {
                message.error(responseData.message || 'Có lỗi xảy ra')
            }
        } catch (error) {
            message.error('Lỗi kết nối server')
        }
    }

    const columns = [
        { title: 'SKU', dataIndex: 'maSKU', key: 'sku', render: text => <span className="font-mono font-medium">{text}</span> },
        { title: 'Tên linh kiện', dataIndex: 'tenLinhKien', key: 'name' },
        { title: 'Danh mục', dataIndex: 'danhMuc', key: 'category' },
        { title: 'Tồn kho', dataIndex: 'soLuongTon', key: 'quantity', render: (qty, r) => <Tag color={qty <= (r.tonToiThieu || 5) ? 'red' : 'green'}>{qty}</Tag> },
        { title: 'Giá nhập', dataIndex: 'giaNhap', key: 'costPrice', render: p => <span className="text-gray-500">{p?.toLocaleString('vi-VN') || 0}đ</span> },
        { title: 'Giá bán', dataIndex: 'giaBan', key: 'price', render: p => <span className="font-medium text-blue-600">{(p || 0).toLocaleString('vi-VN')}đ</span> },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="dashed" size="small" icon={<ImportOutlined />} onClick={() => handleImport(record)}>Nhập kho</Button>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={4} className="!mb-0">Quản lý kho hàng</Title>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchInventory}>Làm mới</Button>
                    <Button icon={<ExportOutlined />}>Xuất Excel</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm linh kiện mới</Button>
                </Space>
            </div>

            <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    rowKey="_id" 
                    loading={loading}
                    pagination={{ pageSize: 10 }} 
                />
            </Card>

            {/* Modal Update/Create Item */}
            <Modal title={editingItem ? 'Sửa thông tin linh kiện' : 'Thêm linh kiện mới'} open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
                    {!editingItem && (
                        <Form.Item name="sku" label="Mã SKU (Bỏ trống sẽ tự tạo tự động)">
                            <Input placeholder="VD: RAM-DDR4-8G" />
                        </Form.Item>
                    )}
                    <Form.Item name="name" label="Tên linh kiện" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input placeholder="VD: RAM DDR4 8GB" />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
                        <Select placeholder="Chọn danh mục">
                            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                    </Form.Item>
                    {!editingItem && (
                        <Form.Item name="quantity" label="Số lượng ban đầu" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="costPrice" label="Giá nhập" rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}>
                            <InputNumber min={0} className="w-full" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/,/g, '')} addonAfter="đ" />
                        </Form.Item>
                        <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}>
                            <InputNumber min={0} className="w-full" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/,/g, '')} addonAfter="đ" />
                        </Form.Item>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={() => setModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Lưu</Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal Import Stock */}
            <Modal title={`Nhập thêm kho: ${importingItem?.tenLinhKien}`} open={importModalVisible} onCancel={() => setImportModalVisible(false)} footer={null} width={400}>
                <Form form={importForm} layout="vertical" onFinish={handleSaveImport} className="mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
                        <div className="flex justify-between">
                            <span>Mã SKU:</span>
                            <span className="font-mono font-medium">{importingItem?.maSKU}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Tồn kho hiện tại:</span>
                            <span className="font-medium text-lg">{importingItem?.soLuongTon}</span>
                        </div>
                    </div>
                    
                    <Form.Item name="soLuongNhap" label="Số lượng nhập thêm" rules={[{ required: true, message: 'Vui lòng nhập số lượng > 0' }]}>
                        <InputNumber min={1} className="w-full" size="large" />
                    </Form.Item>

                    <Form.Item name="giaNhapMoi" label="Cập nhật giá mua mới (nếu có)" rules={[{ required: true }]}>
                        <InputNumber min={0} className="w-full" formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/,/g, '')} addonAfter="đ" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button onClick={() => setImportModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" icon={<ImportOutlined />}>Xác nhận nhập kho</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default InventoryManagement

