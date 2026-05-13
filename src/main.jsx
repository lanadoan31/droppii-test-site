import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import AdminAppV2New from './admin-v2-new/AdminAppV2.jsx'

const path = window.location.pathname

if (path === '/' || path === '') {
  window.location.replace('/admin-v2-new')
} else if (path.startsWith('/admin-v2') && !path.startsWith('/admin-v2-new')) {
  window.location.replace('/admin-v2-new' + path.slice('/admin-v2'.length))
} else {
  const isAdminV2New = path.startsWith('/admin-v2-new')
  const isAdmin = !path.startsWith('/admin-v2') && path.startsWith('/admin')
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {isAdminV2New ? <AdminAppV2New /> : isAdmin ? <AdminApp /> : <App />}
    </StrictMode>,
  )
}
