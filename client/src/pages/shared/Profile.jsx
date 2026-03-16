import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Divider, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const Profile = () => {
    const { user, login } = useAuth(); // We might just refresh page or rely on AuthContext if needed, but since AuthContext fetches from login, we might need a way to refresh. Actually, getMe is usually better, but let's just use fetch directly.
    const [detailsForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        // Fetch current user details to populate form
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    detailsForm.setFieldsValue({
                        hoTen: data.data.hoTen,
                        soDienThoai: data.data.soDienThoai,
                        email: data.data.email,
                        diaChi: data.data.diaChi
                    });
                }
            } catch (err) {
                console.error('Failed to fetch user data', err);
                message.error('Không thể tải thông tin người dùng');
            }
        };

        fetchUserData();
    }, [detailsForm]);

    const handleUpdateDetails = async (values) => {
        setLoadingDetails(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/updatedetails', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });
            const data = await res.json();

            if (data.success) {
                message.success('Cập nhật thông tin thành công');
                // Update local storage user just in case
                const savedUser = JSON.parse(localStorage.getItem('user'));
                if (savedUser) {
                    savedUser.name = data.data.hoTen;
                    savedUser.phone = data.data.soDienThoai;
                    savedUser.email = data.data.email;
                    localStorage.setItem('user', JSON.stringify(savedUser));
                    // Force reload to update context and navbar if needed
                    window.location.reload(); 
                }
            } else {
                message.error(data.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            message.error('Lỗi kết nối máy chủ');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleUpdatePassword = async (values) => {
        setLoadingPassword(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                })
            });
            const data = await res.json();

            if (data.success) {
                message.success('Đổi mật khẩu thành công');
                passwordForm.resetFields();
            } else {
                message.error(data.message || 'Đổi mật khẩu thất bại');
            }
        } catch (err) {
            message.error('Lỗi kết nối máy chủ');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <Title level={2} className="!mb-0 text-gray-800">
                    Hồ sơ cá nhân
                </Title>
            </div>

            <Card className="shadow-sm rounded-xl overflow-hidden border-gray-100">
                <Title level={4} className="mb-6 flex items-center gap-2">
                    <UserOutlined className="text-primary-600" />
                    Thông tin liên hệ
                </Title>
                <Form
                    form={detailsForm}
                    layout="vertical"
                    onFinish={handleUpdateDetails}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="hoTen"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                        >
                            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nhập họ tên" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="soDienThoai"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="Nhập số điện thoại" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
                        >
                            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Nhập email" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="diaChi"
                            label="Địa chỉ"
                        >
                            <Input prefix={<HomeOutlined className="text-gray-400" />} placeholder="Nhập địa chỉ" size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item className="mb-0 flex justify-end mt-4">
                        <Button type="primary" htmlType="submit" className="gradient-primary border-none w-32" size="large" loading={loadingDetails}>
                            Lưu thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card className="shadow-sm rounded-xl overflow-hidden border-gray-100">
                <Title level={4} className="mb-6 flex items-center gap-2">
                    <LockOutlined className="text-primary-600" />
                    Đổi mật khẩu
                </Title>
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleUpdatePassword}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                    >
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Nhập mật khẩu hiện tại" size="large" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Nhập mật khẩu mới" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Xác nhận mật khẩu mới" size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item className="mb-0 flex justify-end mt-4">
                        <Button type="primary" htmlType="submit" className="gradient-primary border-none w-32" size="large" loading={loadingPassword}>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
