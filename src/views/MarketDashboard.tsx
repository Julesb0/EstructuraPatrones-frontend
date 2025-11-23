import { useEffect, useMemo, useState } from 'react'
import { ui, colors } from '../theme'

type Overview = { id: string, name: string, platform: string, avgPrice: number, rating: number, sales: number }
type PricePoint = { ts: number, price: number }
type Risk = { riskScore: number, volatility: number, ratingFactor: number, negativeReviewFactor: number, aiTips: string[] }
type Profitability = { expectedROI: number, marginPercent: number, revenueTrend: string, aiTips: string[] }

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8080')

export default function MarketDashboard() {
  const [platform, setPlatform] = useState('amazon')
  const [productId, setProductId] = useState('demo-1')
  const [cost, setCost] = useState('')
  const [overview, setOverview] = useState<Overview | null>(null)
  const [series, setSeries] = useState<PricePoint[]>([])
  const [risk, setRisk] = useState<Risk | null>(null)
  const [profit, setProfit] = useState<Profitability | null>(null)
  const [aiAdvice, setAiAdvice] = useState<string[]>([])
  const [error, setError] = useState('')

  function authHeader(): HeadersInit {
    const token = localStorage.getItem('token')
    const h: Record<string, string> = {}
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  async function load() {
    setError('')
    try {
      const ovRes = await fetch(`${API_BASE}/api/market/product/${encodeURIComponent(productId)}/overview?platform=${platform}`, { headers: authHeader() })
      const ov = await ovRes.json()
      const phRes = await fetch(`${API_BASE}/api/market/product/${encodeURIComponent(productId)}/price-history?platform=${platform}&days=90`, { headers: authHeader() })
      const ph = await phRes.json()
      const rkRes = await fetch(`${API_BASE}/api/market/product/${encodeURIComponent(productId)}/risk?platform=${platform}`, { headers: authHeader() })
      const rk = await rkRes.json()
      const costParam = cost ? `&cost=${encodeURIComponent(cost)}` : ''
      const pfRes = await fetch(`${API_BASE}/api/market/product/${encodeURIComponent(productId)}/profitability?platform=${platform}${costParam}`, { headers: authHeader() })
      const pf = await pfRes.json()
      const inRes = await fetch(`${API_BASE}/api/market/product/${encodeURIComponent(productId)}/insights?platform=${platform}${costParam}`, { headers: authHeader() })
      const ins = await inRes.json()
      setOverview(ov)
      setSeries(ph)
      setRisk(rk)
      setProfit(pf)
      setAiAdvice(ins.aiAdvice || [])
    } catch (e: any) {
      setError(e?.message || 'Error al cargar datos')
    }
  }

  useEffect(() => { /* no auto-load */ }, [])

  const svgWidth = 600
  const svgHeight = 200
  const padding = 30
  const chartData = useMemo(() => {
    if (!series || series.length === 0) return null
    const xs = series.map(p => p.ts)
    const ys = series.map(p => p.price)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    function sx(x: number) { return padding + (x - minX) * (svgWidth - 2*padding) / (maxX - minX || 1) }
    function sy(y: number) { return svgHeight - padding - (y - minY) * (svgHeight - 2*padding) / (maxY - minY || 1) }
    const path = series.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.ts)},${sy(p.price)}`).join(' ')
    const points = series.map(p => ({ cx: sx(p.ts), cy: sy(p.price), val: p.price }))
    const ticksX = [minX, (minX+maxX)/2, maxX]
    const ticksY = [minY, (minY+maxY)/2, maxY]
    return { path, points, ticksX, ticksY, minY, maxY }
  }, [series])

  return (
    <div style={ui.card as any}>
      <h2 style={ui.heading as any}>Market Dashboard</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <label>Plataforma: </label>
        <input style={ui.input as any} value={platform} onChange={e => setPlatform(e.target.value)} />
        <label> Producto: </label>
        <input style={ui.input as any} value={productId} onChange={e => setProductId(e.target.value)} />
        <label> Costo (opcional): </label>
        <input style={ui.input as any} value={cost} onChange={e => setCost(e.target.value)} />
        <button style={ui.button as any} onClick={load}>Cargar datos</button>
      </div>
      {error && <div style={{ color: colors.indigo }}>Error: {error}</div>}
      {overview && (
        <div style={{ marginTop: 8 }}>
          <h3 style={{ color: colors.purple }}>Overview</h3>
          <div>ID: {overview.id}</div>
          <div>Nombre: {overview.name}</div>
          <div>Plataforma: {overview.platform}</div>
          <div>Precio medio: {overview.avgPrice.toFixed(2)}</div>
          <div>Rating: {overview.rating.toFixed(2)}</div>
          <div>Ventas: {overview.sales}</div>
        </div>
      )}
      <h3 style={{ color: colors.purple }}>Precio (90 días)</h3>
      <svg width={svgWidth} height={svgHeight}>
        <rect x={0} y={0} width={svgWidth} height={svgHeight} fill={colors.softPink} opacity={0.2} />
        <line x1={padding} y1={svgHeight-padding} x2={svgWidth-padding} y2={svgHeight-padding} stroke={colors.indigo} />
        <line x1={padding} y1={padding} x2={padding} y2={svgHeight-padding} stroke={colors.indigo} />
        {chartData && <path d={chartData.path} stroke={colors.magenta} fill="none" strokeWidth={2} />}
        {chartData && chartData.points.map((pt, idx) => (
          <circle key={idx} cx={pt.cx} cy={pt.cy} r={3} fill={colors.pink} onClick={() => alert(`Precio: ${pt.val.toFixed(2)}`)} />
        ))}
      </svg>
      {risk && (
        <div style={{ marginTop: 12 }}>
          <h3 style={{ color: colors.purple }}>Riesgo</h3>
          <div>Score: {risk.riskScore.toFixed(2)}</div>
          <div>Volatilidad: {risk.volatility.toFixed(2)}</div>
          <div>Rating: {risk.ratingFactor.toFixed(2)}</div>
          <div>Negativas: {risk.negativeReviewFactor.toFixed(2)}</div>
          <h4 style={{ color: colors.magenta }}>Gráfico de factores</h4>
          <svg width={svgWidth} height={150}>
            {['Vol', 'Rat', 'Neg'].map((label, i) => {
              const v = i===0? risk.volatility : i===1? risk.ratingFactor : risk.negativeReviewFactor
              const h = v * 100
              const x = 50 + i*150
              return (
                <g key={i}>
                  <rect x={x} y={140 - h} width={40} height={h} fill={colors.purple} />
                  <text x={x} y={145} fontSize="10">{label}</text>
                </g>
              )
            })}
          </svg>
          <h4 style={{ color: colors.magenta }}>Consejos de IA</h4>
          <ul>
            {(risk.aiTips||[]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      {profit && (
        <div style={{ marginTop: 12 }}>
          <h3 style={{ color: colors.purple }}>Rentabilidad</h3>
          <div>ROI: {profit.expectedROI.toFixed(2)}</div>
          <div>Margen %: {profit.marginPercent.toFixed(2)}</div>
          <div>Tendencia: {profit.revenueTrend}</div>
          <h4 style={{ color: colors.magenta }}>Consejos de IA</h4>
          <ul>
            {(profit.aiTips||[]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      <h3 style={{ color: colors.purple }}>IA (insights combinados)</h3>
      <ul>
        {aiAdvice.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}
