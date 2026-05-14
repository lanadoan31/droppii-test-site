import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import AdminAppV2New from './admin-v2-new/AdminAppV2.jsx'
import { SELLER_TEST_PATH } from './lib/publicSiteUrl.js'

const path = window.location.pathname

if (path.startsWith('/admin-v2') && !path.startsWith('/admin-v2-new')) {
  window.location.replace('/admin-v2-new' + path.slice('/admin-v2'.length))
} else if (path === '/' || path === '') {
  window.location.replace('/admin-v2-new')
} else {
  const isSellerTake = path === SELLER_TEST_PATH || path.startsWith(`${SELLER_TEST_PATH}/`)
  const isAdminV2New = path.startsWith('/admin-v2-new')
  const isAdmin = !path.startsWith('/admin-v2') && path.startsWith('/admin')
  /** Seller app: dedicated `/take` route, or any non-admin path (legacy). */
  const showSellerApp = isSellerTake || (!isAdminV2New && !isAdmin)
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {showSellerApp ? <App /> : isAdminV2New ? <AdminAppV2New /> : <AdminApp />}
    </StrictMode>,
  )
}
