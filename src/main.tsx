import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider><WishlistProvider><CartProvider><CatalogProvider><SiteSettingsProvider><App/></SiteSettingsProvider></CatalogProvider></CartProvider></WishlistProvider></ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
