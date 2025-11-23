import { Link, Outlet } from 'react-router-dom'
import { ui } from './theme'

export default function App() {
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('token')
  return (
    <div style={ui.pageBg as any}>
      <nav style={ui.nav as any}>
        {!isAuthed && <Link to="/inicio">Inicio</Link>}
        {!isAuthed && <Link to="/login">Login</Link>}
        {!isAuthed && <Link to="/register">Registro</Link>}
        {isAuthed && <Link to="/welcome" style={ui.link as any}>Bienvenida</Link>}
        {isAuthed && <Link to="/market" style={ui.link as any}>Market</Link>}
        {isAuthed && <Link to="/market/rankings" style={ui.link as any}>Rankings</Link>}
        {isAuthed && <Link to="/market/url-ai" style={ui.link as any}>URL AI</Link>}
      </nav>
      <div style={ui.container as any}>
        <Outlet />
      </div>
    </div>
  )
}
