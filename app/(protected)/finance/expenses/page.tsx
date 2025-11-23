"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { addExpense } from "@/lib/api-client"

const expenseTypes = ["Alimentación", "Transporte", "Servicios", "Salud", "Educación", "Entretenimiento", "Otro"]

export default function ExpensesPage() {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("Otro")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [recurring, setRecurring] = useState(false)
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
      await addExpense({
        amount: Number.parseFloat(amount),
        type,
        date,
        description,
        recurring,
        userEmail,
      })
      setSuccess(true)
      setAmount("")
      setType("Otro")
      setDate("")
      setDescription("")
      setRecurring(false)
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
        <h1 className="prose-title mb-2">Registrar Gasto</h1>
        <p className="prose-subtitle mb-8">Añade un nuevo gasto a tu cuenta</p>

        <div className="bg-card rounded-lg p-8 border border-border">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-foreground mb-2">Categoría</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="input-field w-full">
                  {expenseTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
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
                placeholder="Describe el gasto..."
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground">Es un gasto recurrente</span>
            </label>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ¡Gasto registrado exitosamente!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Registrar Gasto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
