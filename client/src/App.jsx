import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from './contexts/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import Home from './pages/public/Home'
import BookAppointment from './pages/public/BookAppointment'
import StatusLookup from './pages/public/StatusLookup'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import InventoryManagement from './pages/admin/InventoryManagement'
import Reports from './pages/admin/Reports'

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/Dashboard'
import OrderIntake from './pages/receptionist/OrderIntake'
import AppointmentList from './pages/receptionist/AppointmentList'
import QuoteManagement from './pages/receptionist/QuoteManagement'

// Technician Pages
import TechnicianDashboard from './pages/technician/Dashboard'
import WorkList from './pages/technician/WorkList'
import OrderDetail from './pages/technician/OrderDetail'
import PartsRequest from './pages/technician/PartsRequest'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth()

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const roleRedirects = {
            admin: '/admin',
            receptionist: '/receptionist',
            technician: '/technician',
            customer: '/',
        }
        return <Navigate to={roleRedirects[user.role] || '/'} replace />
    }

    return children
}

function App() {
    const { loading } = useAuth()

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="book-appointment" element={<BookAppointment />} />
                <Route path="status-lookup" element={<StatusLookup />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="reports" element={<Reports />} />
            </Route>

            {/* Receptionist Routes */}
            <Route
                path="/receptionist"
                element={
                    <ProtectedRoute allowedRoles={['receptionist']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<ReceptionistDashboard />} />
                <Route path="orders" element={<OrderIntake />} />
                <Route path="appointments" element={<AppointmentList />} />
                <Route path="customers" element={<QuoteManagement />} />
            </Route>

            {/* Technician Routes */}
            <Route
                path="/technician"
                element={
                    <ProtectedRoute allowedRoles={['technician']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<TechnicianDashboard />} />
                <Route path="tasks" element={<WorkList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="inventory" element={<PartsRequest />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
