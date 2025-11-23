"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { addIncome } from "@/lib/api-client"

export default function IncomePage() {
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail") || "user@example.com"
      setUserEmail(email)
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const isoDate = (() => {
        const d = date.trim()
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
        const parts = d.split(/[\/\-]/)
        if (parts.length === 3) {
          if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`
          return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`
        }
        const dt = new Date(d)
        const y = dt.getFullYear()
        const m = String(dt.getMonth() + 1).padStart(2, "0")
        const da = String(dt.getDate()).padStart(2, "0")
        return `${y}-${m}-${da}`
      })()
      await addIncome({
        amount: Number.parseFloat(amount),
        date: isoDate,
        description,
        userEmail,
      })
      setSuccess(true)
      setAmount("")
      setDate("")
      setDescription("")
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="prose-title mb-2">Registrar Ingreso</h1>
        <p className="prose-subtitle mb-8">Añade un nuevo ingreso a tu cuenta</p>

        <div className="bg-card rounded-lg p-8 border border-border">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cantidad</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  step="0.01"
                  className="input-field flex-1"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input-field w-full min-h-24"
                placeholder="Describe el origen del ingreso..."
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ¡Ingreso registrado exitosamente!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Registrar Ingreso"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
