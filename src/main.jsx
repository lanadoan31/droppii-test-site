import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import AdminAppV2 from './admin-v2/AdminAppV2.jsx'

const path = window.location.pathname
const isAdminV2 = path.startsWith('/admin-v2')
const isAdmin   = !isAdminV2 && path.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminV2 ? <AdminAppV2 /> : isAdmin ? <AdminApp /> : <App />}
  </StrictMode>,
)
