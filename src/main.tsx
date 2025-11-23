import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './views/Login'
import Register from './views/Register'
import Welcome from './views/Welcome'
// módulos financieros eliminados del enrutador
import Inicio from './views/Inicio'
import MarketDashboard from './views/MarketDashboard'
import MarketRankings from './views/MarketRankings'
import MarketUrlAi from './views/MarketUrlAi'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />
          {/* rutas de módulos eliminados: dashboard, ingreso, gasto, microgasto, historial, nimai */}
          <Route path="/market" element={<MarketDashboard />} />
          <Route path="/market/rankings" element={<MarketRankings />} />
          <Route path="/market/url-ai" element={<MarketUrlAi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
