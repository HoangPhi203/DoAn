import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

// Ant Design theme configuration
const theme = {
    token: {
        colorPrimary: '#2563eb',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#3b82f6',
        borderRadius: 8,
        fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
    },
    components: {
        Button: {
            controlHeight: 40,
            borderRadius: 8,
        },
        Input: {
            controlHeight: 40,
            borderRadius: 8,
        },
        Select: {
            controlHeight: 40,
            borderRadius: 8,
        },
        Card: {
            borderRadius: 12,
        },
        Table: {
            borderRadius: 12,
        },
    },
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider locale={viVN} theme={theme}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
