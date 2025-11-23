"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navigationItems = [
  { href: "/welcome", label: "Panel Principal", icon: "📊" },
  { href: "/finance/dashboard", label: "Finanzas", icon: "💰" },
  { href: "/finance/income", label: "Ingresos", icon: "📈" },
  { href: "/finance/expenses", label: "Gastos", icon: "📉" },
  { href: "/market/dashboard", label: "Market", icon: "🛍️" },
  { href: "/market/rankings", label: "Rankings", icon: "🏆" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      setIsAuthed(!!token)
    }
  }, [])

  if (!isAuthed) return null

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border pt-20 overflow-y-auto hidden lg:block">
      <nav className="flex flex-col gap-2 p-4">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname.startsWith(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/10"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
