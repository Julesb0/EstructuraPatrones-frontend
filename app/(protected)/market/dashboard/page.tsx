"use client"

import { useState, useMemo } from "react"
import {
  getMarketProduct,
  getMarketPriceHistory,
  getMarketRisk,
  getMarketProfitability,
  getMarketInsights,
} from "@/lib/api-client"

interface MarketProduct {
  id: string
  name: string
  platform: string
  avgPrice: number
  rating: number
  sales: number
}

interface PricePoint {
  ts: number
  price: number
}

interface RiskData {
  riskScore: number
  volatility: number
  ratingFactor: number
  negativeReviewFactor: number
  aiTips: string[]
}

interface ProfitabilityData {
  expectedROI: number
  marginPercent: number
  revenueTrend: string
  aiTips: string[]
}

export default function MarketDashboardPage() {
  const [platform, setPlatform] = useState("mercadolibre")
  const [productId, setProductId] = useState("demo-1")
  const [cost, setCost] = useState("")
  const [product, setProduct] = useState<MarketProduct | null>(null)
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [riskData, setRiskData] = useState<RiskData | null>(null)
  const [profitData, setProfitData] = useState<ProfitabilityData | null>(null)
  const [aiAdvice, setAiAdvice] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [prod, prices, risk, profit, insights] = await Promise.all([
        getMarketProduct(productId, platform),
        getMarketPriceHistory(productId, platform),
        getMarketRisk(productId, platform),
        getMarketProfitability(productId, platform, cost || undefined),
        getMarketInsights(productId, platform, cost || undefined),
      ])

      setProduct(prod)
      setPriceHistory(prices)
      setRiskData(risk)
      setProfitData(profit)
      setAiAdvice(insights.aiAdvice || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return null

    const svgWidth = 600
    const svgHeight = 200
    const padding = 30

    const xs = priceHistory.map((p) => p.ts)
    const ys = priceHistory.map((p) => p.price)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const sx = (x: number) => padding + ((x - minX) * (svgWidth - 2 * padding)) / (maxX - minX || 1)
    const sy = (y: number) => svgHeight - padding - ((y - minY) * (svgHeight - 2 * padding)) / (maxY - minY || 1)

    const path = priceHistory.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.ts)},${sy(p.price)}`).join(" ")

    return {
      path,
      points: priceHistory.map((p) => ({ cx: sx(p.ts), cy: sy(p.price), price: p.price })),
      minY,
      maxY,
      svgWidth,
      svgHeight,
      padding,
    }
  }, [priceHistory])

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="prose-title mb-2">Market Dashboard</h1>
        <p className="prose-subtitle mb-8">Analiza productos y oportunidades de mercado</p>

        {/* Search Controls */}
        <div className="bg-card rounded-lg p-6 border border-border mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Plataforma</label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="input-field w-full"
                placeholder="mercadolibre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Producto</label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="input-field w-full"
                placeholder="demo-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Costo (opcional)</label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="input-field w-full"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <button onClick={loadData} disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? "Cargando..." : "Cargar Datos"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {product && (
          <>
            {/* Product Overview */}
            <div className="bg-card rounded-lg p-6 border border-border mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Información del Producto</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="text-lg font-semibold text-foreground">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="text-lg font-semibold text-foreground">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precio Promedio</p>
                  <p className="text-lg font-semibold text-green-600">${product.avgPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-lg font-semibold text-foreground">{product.rating.toFixed(2)}/5</p>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            {chartData && (
              <div className="bg-card rounded-lg p-6 border border-border mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Histórico de Precio (90 días)</h2>
                <div className="overflow-x-auto">
                  <svg width={chartData.svgWidth} height={chartData.svgHeight} className="mx-auto">
                    <rect
                      x={0}
                      y={0}
                      width={chartData.svgWidth}
                      height={chartData.svgHeight}
                      fill="var(--color-muted)"
                      opacity={0.1}
                    />
                    <line
                      x1={chartData.padding}
                      y1={chartData.svgHeight - chartData.padding}
                      x2={chartData.svgWidth - chartData.padding}
                      y2={chartData.svgHeight - chartData.padding}
                      stroke="var(--color-border)"
                    />
                    <line
                      x1={chartData.padding}
                      y1={chartData.padding}
                      x2={chartData.padding}
                      y2={chartData.svgHeight - chartData.padding}
                      stroke="var(--color-border)"
                    />
                    <path d={chartData.path} stroke="var(--color-accent)" fill="none" strokeWidth={2} />
                    {chartData.points.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.cx}
                        cy={pt.cy}
                        r={4}
                        fill="var(--color-primary)"
                        className="cursor-pointer hover:r-6"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* Risk Analysis */}
            {riskData && (
              <div className="bg-card rounded-lg p-6 border border-border mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Análisis de Riesgo</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Score de Riesgo</p>
                        <p className="text-2xl font-bold text-destructive">{riskData.riskScore.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Volatilidad</p>
                        <p className="text-2xl font-bold text-foreground">{riskData.volatility.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating Factor</p>
                        <p className="text-2xl font-bold text-foreground">{riskData.ratingFactor.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reseñas Negativas</p>
                        <p className="text-2xl font-bold text-foreground">{riskData.negativeReviewFactor.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Consejos de IA</p>
                    <ul className="space-y-2">
                      {riskData.aiTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-foreground flex gap-2">
                          <span className="text-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Profitability */}
            {profitData && (
              <div className="bg-card rounded-lg p-6 border border-border mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Rentabilidad</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ROI Esperado</p>
                        <p className="text-2xl font-bold text-green-600">{profitData.expectedROI.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Margen</p>
                        <p className="text-2xl font-bold text-foreground">{profitData.marginPercent.toFixed(2)}%</p>
                      </div>
                      <div colSpan={2} className="col-span-2">
                        <p className="text-sm text-muted-foreground">Tendencia</p>
                        <p className="text-lg font-semibold text-foreground">{profitData.revenueTrend}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">Consejos de IA</p>
                    <ul className="space-y-2">
                      {profitData.aiTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-foreground flex gap-2">
                          <span className="text-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights */}
            {aiAdvice.length > 0 && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Análisis IA</h2>
                <ul className="space-y-3">
                  {aiAdvice.map((advice, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-accent text-lg">✨</span>
                      <span className="text-foreground">{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {!loading && !product && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ingresa los datos del producto y presiona "Cargar Datos"</p>
          </div>
        )}
      </div>
    </div>
  )
}
