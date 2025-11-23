"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      router.push("/welcome")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent/20">
      <div className="text-center">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-foreground">Cargando...</p>
      </div>
    </div>
  )
}
