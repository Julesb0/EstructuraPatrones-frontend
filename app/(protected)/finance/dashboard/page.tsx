"use client"

import { useEffect, useState } from "react"
import { getDashboard, getTransactions, deleteTransaction } from "@/lib/api-client"

interface DashboardData {
  income?: number | string
  expense?: number | string
  balance?: number | string
}

export default function FinanceDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail") || "user@example.com"
      setUserEmail(email)
    }
  }, [])

  useEffect(() => {
    if (!userEmail) return

    async function loadDashboard() {
      setLoading(true)
      setError(null)
      try {
        const [dash, txs] = await Promise.all([
          getDashboard(userEmail, year, month),
          getTransactions(userEmail),
        ])
        setData(dash)
        setTransactions(txs)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [userEmail, year, month])

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">⏳</div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const asNum = (v: any) => (typeof v === "string" ? Number.parseFloat(v) : (typeof v === "number" ? v : 0))
  const totalIncome = asNum(data?.income)
  const totalExpenses = asNum(data?.expense)
  const balance = asNum(data?.balance ?? (totalIncome - totalExpenses))

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="prose-title mb-2">Dashboard Financiero</h1>
        <p className="prose-subtitle mb-8">Visualiza tu situación financiera</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Date Filter */}
        <div className="flex gap-4 mb-8">
          <select value={month} onChange={(e) => setMonth(Number.parseInt(e.target.value))} className="input-field">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString("es", { month: "long" })}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number.parseInt(e.target.value))} className="input-field">
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - 2 + i
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            })}
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Ingresos</p>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Gastos</p>
            <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p className={`text-3xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Transacciones Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Descripción</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cantidad</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions && transactions.length > 0 ? (
                  transactions.map((tx: any, idx) => (
                    <tr key={idx} className="hover:bg-muted/50">
                      <td className="px-6 py-3 text-sm text-foreground">{tx.date}</td>
                      <td className="px-6 py-3 text-sm text-foreground">{tx.description}</td>
                      <td className="px-6 py-3 text-sm font-medium">${(typeof tx.amount === "string" ? Number.parseFloat(tx.amount) : tx.amount).toFixed(2)}</td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            (tx.kind === "ingreso") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {(tx.kind === "ingreso") ? "Ingreso" : (tx.kind === "microgasto" ? "Microgasto" : "Gasto")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button
                          className="btn-primary bg-destructive text-white px-3 py-1 rounded"
                          onClick={async () => {
                            try {
                              setLoading(true)
                              setError(null)
                              await deleteTransaction(tx.id, tx.kind)
                              const [dash, txs] = await Promise.all([
                                getDashboard(userEmail, year, month),
                                getTransactions(userEmail),
                              ])
                              setData(dash)
                              setTransactions(txs)
                            } catch (err: any) {
                              setError(err.message)
                            } finally {
                              setLoading(false)
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No hay transacciones para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
