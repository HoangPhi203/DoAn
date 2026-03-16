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
import PlaceholderPage from './pages/public/PlaceholderPage'
import About from './pages/public/About'
import News from './pages/public/News'
import Pricing from './pages/public/Pricing'
import Policy from './pages/public/Policy'
import Contact from './pages/public/Contact'
import Reviews from './pages/public/Reviews'

// Auth Pages
import Login from './pages/auth/Login'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import InventoryManagement from './pages/admin/InventoryManagement'
import Reports from './pages/admin/Reports'
import WarrantyManagement from './pages/admin/WarrantyManagement'

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

// Shared Pages
import Profile from './pages/shared/Profile'

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

// Require Authentication for certain public pages
const RequireAuth = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
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
            {/* Public Routes - accessible without login */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="news/*" element={<News />} />
                <Route path="pricing/*" element={<Pricing />} />
                <Route path="contact" element={<Contact />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="policy/*" element={<Policy />} />

                {/* Routes requiring login */}
                <Route path="book-appointment" element={<BookAppointment />} />
                <Route path="status-lookup" element={<StatusLookup />} />

            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

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
                <Route path="warranty" element={<WarrantyManagement />} />
                {/* Admin also gets receptionist features */}
                <Route path="orders" element={<OrderIntake />} />
                <Route path="appointments" element={<AppointmentList />} />
                <Route path="quotes" element={<QuoteManagement />} />
                {/* Admin also gets technician features */}
                <Route path="tasks" element={<WorkList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="parts" element={<PartsRequest />} />
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
                <Route path="tasks" element={<WorkList />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="customers" element={<QuoteManagement />} />
                <Route path="warranty" element={<WarrantyManagement />} />
                <Route path="profile" element={<Profile />} />
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
