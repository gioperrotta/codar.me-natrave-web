import React from 'react'
import ReactDOM from 'react-dom/client'
// import { App } from './pages/home'
import { Router } from './pages';
import './global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
