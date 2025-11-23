import { useEffect, useState } from 'react'
import { getNimAi6 } from '../api/finance'

export default function NimAi() {
  const userEmail = localStorage.getItem('username') || ''
  const now = new Date()
  const [tips, setTips] = useState<string[]>([])
  const [months, setMonths] = useState<any[]>([])
  const [trends, setTrends] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getNimAi6({ userEmail, year: now.getFullYear(), month: now.getMonth() + 1 })
      .then((res) => { setTips(res.tips || []); setMonths(res.months || []); setTrends(res.trends || []) })
      .catch(e => setError(e.message))
  }, [])

  return (
    <div>
      <h2>NimAi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tips.map((t, i) => (<li key={i}>{t}</li>))}
      </ul>
      <h3>Últimos 6 meses</h3>
      <pre>{JSON.stringify(months, null, 2)}</pre>
      <h3>Tendencias por categoría</h3>
      <ul>
        {trends.map((t, i) => (<li key={i}>{t.category}: {t.trend} (prev3 {String(t.prev3)} vs last3 {String(t.last3)})</li>))}
      </ul>
    </div>
  )
}
