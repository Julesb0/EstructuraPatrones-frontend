import { useEffect, useState } from 'react'
import { getTransactions } from '../api/finance'

export default function TransactionsPage() {
  const userEmail = localStorage.getItem('username') || ''
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTransactions(userEmail).then(setItems).catch(e => setError(e.message))
  }, [])

  return (
    <div>
      <h2>Historial</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map((t, i) => (
          <li key={i}>{String(t.date)} - {String(t.amount)} - {t.description} ({t.kind}{t.kind === 'gasto' && t.type ? ':' + t.type : ''}{t.recurring ? ', recurrente' : ''})</li>
        ))}
      </ul>
    </div>
  )
}
