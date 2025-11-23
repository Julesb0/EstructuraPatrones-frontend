"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const name = localStorage.getItem("username")
      setIsAuthed(!!token)
      setUsername(name || "Usuario")
    }
  }, [])

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-card border-b border-border lg:left-64">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">HotCash</h1>
        <div className="flex items-center gap-6">
          {isAuthed && (
            <>
              <span className="text-sm text-muted-foreground">Hola, {username}</span>
              <nav className="flex items-center gap-3">
                <Link href="/welcome" className="btn-ghost text-sm">Inicio</Link>
                <Link href="/finance/dashboard" className="btn-ghost text-sm">Finanzas</Link>
                <Link href="/market/rankings" className="btn-ghost text-sm">Market</Link>
                <Link href="/networking/profile" className="btn-ghost text-sm">Perfil</Link>
                <Link href="/networking/connections" className="btn-ghost text-sm">Conexiones</Link>
                <Link href="/networking/profiles" className="btn-ghost text-sm">Perfiles</Link>
              </nav>
              <button onClick={logout} className="btn-secondary text-sm">
                Cerrar sesión
              </button>
            </>
          )}
          {!isAuthed && (
            <nav className="flex gap-4">
              <Link href="/login" className="btn-ghost text-sm">
                Iniciar sesión
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Registrarse
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
