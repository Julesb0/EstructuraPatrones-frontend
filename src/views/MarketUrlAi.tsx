import { useState } from 'react'
import { ui, colors } from '../theme'

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8080')

export default function MarketUrlAi() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [host, setHost] = useState('')
  const [tips, setTips] = useState<string[]>([])
  const [error, setError] = useState('')

  async function analyze() {
    setError(''); setTips([]); setTitle(''); setDesc(''); setHost('')
    try {
      const res = await fetch(`${API_BASE}/api/market/ai-url?url=${encodeURIComponent(url)}`)
      if (!res.ok) { throw new Error(`Error ${res.status}`) }
      const data = await res.json()
      setTitle(data.title || '')
      setDesc(data.description || '')
      setHost(data.host || '')
      setTips(data.aiAdvice || [])
    } catch (e: any) {
      setError(e?.message || 'Error al analizar URL')
    }
  }

  return (
    <div style={ui.card as any}>
      <h2 style={ui.heading as any}>Analizar URL con IA</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <label>URL: </label>
        <input style={ui.input as any} value={url} onChange={e => setUrl(e.target.value)} />
        <button style={ui.button as any} onClick={analyze}>Analizar</button>
      </div>
      {error && <div style={{ color: colors.indigo }}>Error: {error}</div>}
      <div style={{ marginBottom: 8 }}>
        <strong>Dominio:</strong> {host || '—'}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Título:</strong> {title || '—'}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Descripción:</strong> {desc || '—'}
      </div>
      <h3 style={{ color: colors.purple }}>Recomendaciones de IA</h3>
      <ul>
        {tips.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}
