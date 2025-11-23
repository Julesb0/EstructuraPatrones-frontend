import { useEffect, useState } from 'react'
import { getDashboard } from '../api/finance'

export default function FinanceDashboard() {
  const username = localStorage.getItem('username') || ''
  const userEmail = username
  const now = new Date()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboard({ userEmail, year: now.getFullYear(), month: now.getMonth() + 1 }).then(setData).catch(e => setError(e.message))
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <strong>Ingresos:</strong> {String(data.income)}
          </div>
          <div>
            <strong>Gastos:</strong> {String(data.expense)}
          </div>
          <div>
            <strong>Balance:</strong> {String(data.balance)}
          </div>
          <div>
            <strong>Tasa gasto/ingreso:</strong> {String(data.ratio)}
          </div>
          <div>
            <strong>Últimos 6 meses:</strong>
            <pre>{JSON.stringify(data.series, null, 2)}</pre>
          </div>
          <div>
            <strong>Recomendaciones:</strong>
            <pre>{JSON.stringify(data.recommendations, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
