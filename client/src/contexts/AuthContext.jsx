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
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Find user in mock data
        const foundUser = mockUsers.find(
            u => u.phone === phone && u.password === password
        )

        if (foundUser) {
            const userData = {
                id: foundUser.id,
                name: foundUser.name,
                phone: foundUser.phone,
                email: foundUser.email,
                role: foundUser.role,
                avatar: foundUser.avatar,
            }
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
            return { success: true, user: userData }
        }

        return { success: false, message: 'Số điện thoại hoặc mật khẩu không đúng' }
    }

    const register = async (userData) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if phone already exists
        const existingUser = mockUsers.find(u => u.phone === userData.phone)
        if (existingUser) {
            return { success: false, message: 'Số điện thoại đã được đăng ký' }
        }

        // Create new user (in real app, this would be an API call)
        const newUser = {
            id: `user_${Date.now()}`,
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            role: 'customer',
            avatar: null,
        }

        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        return { success: true, user: newUser }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
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
        register,
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
