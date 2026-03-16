import { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '../data/mockUsers'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for saved user in localStorage
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    }, [])

    const login = async (phone, password) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soDienThoai: phone, matKhau: password })
            })
            const data = await res.json()
            if (data.success) {
                const roleMap = {
                    'Admin': 'admin',
                    'TiepTan': 'receptionist',
                    'KyThuatVien': 'technician',
                    'KhachHang': 'customer'
                };
                const mappedRole = roleMap[data.user.vaiTro] || 'customer';

                const userDataObj = {
                    id: data.user.id,
                    name: data.user.hoTen,
                    phone: data.user.soDienThoai,
                    email: data.user.email,
                    role: mappedRole,
                }
                setUser(userDataObj)
                localStorage.setItem('user', JSON.stringify(userDataObj))
                localStorage.setItem('token', data.token)
                return { success: true, user: userDataObj }
            } else {
                return { success: false, message: data.message || 'Số điện thoại hoặc mật khẩu không đúng' }
            }
        } catch (err) {
            return { success: false, message: 'Lỗi kết nối server' }
        }
    }


    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    const hasRole = (roles) => {
        if (!user) return false
        if (typeof roles === 'string') {
            return user.role === roles
        }
        return roles.includes(user.role)
    }

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
