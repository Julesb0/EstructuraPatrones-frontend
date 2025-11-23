"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function WelcomePage() {
  const [username, setUsername] = useState("Usuario")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("username")
      setUsername(name || "Usuario")
    }
  }, [])

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="prose-title mb-2">Bienvenido, {username}</h1>
        <p className="prose-subtitle mb-8">Gestiona tus finanzas y analiza oportunidades de mercado</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Finanzas Card */}
          <Link href="/finance/dashboard" className="group">
            <div className="bg-card rounded-lg p-8 border border-border hover:border-secondary/50 transition-colors h-full">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Gestión Financiera</h2>
              <p className="text-muted-foreground mb-4">
                Controla ingresos, gastos y obtén análisis de tus finanzas con IA
              </p>
              <div className="flex gap-2">
                <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded text-sm">Dashboard</span>
                <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded text-sm">Análisis</span>
              </div>
            </div>
          </Link>

          {/* Market Card */}
          <Link href="/market/dashboard" className="group">
            <div className="bg-card rounded-lg p-8 border border-border hover:border-accent/50 transition-colors h-full">
              <div className="text-4xl mb-4">🛍️</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Market Analytics</h2>
              <p className="text-muted-foreground mb-4">
                Analiza productos, precios y rentabilidad con inteligencia artificial
              </p>
              <div className="flex gap-2">
                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded text-sm">Análisis</span>
                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded text-sm">Rankings</span>
              </div>
            </div>
          </Link>

          <Link href="/networking/profile" className="group">
            <div className="bg-card rounded-lg p-8 border border-border hover:border-primary/50 transition-colors h-full">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Networking</h2>
              <p className="text-muted-foreground mb-4">
                Crea tu perfil, explora usuarios y gestiona tus conexiones
              </p>
              <div className="flex gap-2">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-sm">Perfil</span>
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-sm">Conexiones</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Acceso Rápido</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/finance/dashboard"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-foreground">Dashboard Financiero</h3>
            </Link>
            <Link
              href="/finance/income"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-foreground">Registrar Ingreso</h3>
            </Link>
            <Link
              href="/finance/expenses"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">📉</div>
              <h3 className="font-semibold text-foreground">Registrar Gasto</h3>
            </Link>
            <Link
              href="/market/dashboard"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-foreground">Analizar Producto</h3>
            </Link>
            <Link
              href="/market/rankings"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold text-foreground">Ver Rankings</h3>
            </Link>
            <Link
              href="/networking/profile"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-semibold text-foreground">Mi Perfil</h3>
            </Link>
            <Link
              href="/networking/connections"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-semibold text-foreground">Conexiones</h3>
            </Link>
            <Link
              href="/networking/profiles"
              className="bg-card p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="font-semibold text-foreground">Perfiles Públicos</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
