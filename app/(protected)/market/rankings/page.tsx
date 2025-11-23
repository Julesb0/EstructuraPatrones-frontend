"use client"

import { useState, useEffect } from "react"
import { getMarketRankings } from "@/lib/api-client"

interface Ranking {
  id: string
  name: string
  platform: string
  price: number
  rating: number
  sales: number
}

export default function MarketRankingsPage() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [platform, setPlatform] = useState("amazon")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRankings() {
      setLoading(true)
      setError(null)
      try {
        const data = await getMarketRankings(platform)
        setRankings(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadRankings()
  }, [platform])

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="prose-title mb-2">Rankings de Mercado</h1>
        <p className="prose-subtitle mb-8">Descubre los productos más vendidos</p>

        <div className="bg-card rounded-lg p-6 border border-border mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">Filtrar por plataforma</label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="input-field w-full md:w-64"
            placeholder="amazon"
          />
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando rankings...</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Posición</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Precio Promedio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ventas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rankings.length > 0 ? (
                    rankings.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-foreground">{item.name}</td>
                        <td className="px-6 py-3 text-sm text-foreground">${Number(item.price).toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className="flex items-center gap-1">⭐ {Number(item.rating).toFixed(1)}</span>
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-foreground">{item.sales}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
