import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routerApp } from './router/routes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

let router = createBrowserRouter(routerApp)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)