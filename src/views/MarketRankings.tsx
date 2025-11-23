import { useState } from 'react'
import { ui, colors } from '../theme'
import { useNavigate } from 'react-router-dom'

type Item = { id: string, name: string, platform: string, price: number, sales: number, rating: number }
const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8080')

export default function MarketRankings() {
  const [platform, setPlatform] = useState('mercadolibre')
  const [category, setCategory] = useState('all')
  const [limit, setLimit] = useState('5')
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState('')
  const nav = useNavigate()

  function authHeader(): HeadersInit {
    const token = localStorage.getItem('token')
    const h: Record<string, string> = {}
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  async function load() {
    setError('')
    try {
      const limNum = parseInt((limit || '5').trim(), 10)
      const lim = Number.isNaN(limNum) ? 5 : Math.max(1, limNum)
      const url = `${API_BASE}/api/market/rankings?platform=${encodeURIComponent(platform)}&category=${encodeURIComponent(category)}&limit=${lim}`
      const res = await fetch(url, { headers: authHeader() })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Error ${res.status}`)
      }
      const data = await res.json()
      setItems(data)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar ranking')
    }
  }

  return (
    <div style={ui.card as any}>
      <h2 style={ui.heading as any}>Market Rankings</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <label>Plataforma: </label>
        <input style={ui.input as any} value={platform} onChange={e => setPlatform(e.target.value)} />
        <label> Categoría: </label>
        <input style={ui.input as any} value={category} onChange={e => setCategory(e.target.value)} />
        <label> Límite: </label>
        <input style={ui.input as any} value={limit} onChange={e => setLimit(e.target.value)} />
        <button style={ui.button as any} onClick={load}>Cargar ranking</button>
      </div>
      {error && <div style={{ color: colors.indigo }}>Error: {error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={ui.tableHead as any}>
            <th style={{ textAlign: 'left', padding: 8 }}>ID</th><th style={{ textAlign: 'left', padding: 8 }}>Nombre</th><th style={{ textAlign: 'left', padding: 8 }}>Plataforma</th><th style={{ textAlign: 'right', padding: 8 }}>Precio</th><th style={{ textAlign: 'right', padding: 8 }}>Ventas</th><th style={{ textAlign: 'right', padding: 8 }}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} onClick={() => nav(`/market?platform=${encodeURIComponent(it.platform)}&productId=${encodeURIComponent(it.id)}`)} style={{ cursor: 'pointer' }}>
              <td style={{ padding: 8 }}>{it.id}</td><td style={{ padding: 8 }}>{it.name}</td><td style={{ padding: 8 }}>{it.platform}</td><td style={{ padding: 8, textAlign: 'right' }}>{it.price.toFixed(2)}</td><td style={{ padding: 8, textAlign: 'right' }}>{it.sales}</td><td style={{ padding: 8, textAlign: 'right' }}>{it.rating.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
