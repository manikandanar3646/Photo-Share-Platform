import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const path = window.location.pathname

if (path === '/') {
  // Keep the pure HTML home page.
  // React does not need to render anything here.
} else {
  // Hide the HTML home page for React routes.
  const homePage = document.getElementById('home-page')

  if (homePage) {
    homePage.style.display = 'none'
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}