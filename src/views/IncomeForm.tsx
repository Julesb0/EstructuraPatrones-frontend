import { useState } from 'react'
import { addIncome, getTransactions } from '../api/finance'

export default function IncomeForm() {
  const userEmail = localStorage.getItem('username') || ''
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const saved = await addIncome({ amount: Number(amount), date, description, userEmail })
      setMsg('Ingreso registrado')
      const list = await getTransactions(userEmail)
      setItems(list)
    } catch (err: any) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2>Registrar Ingreso</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto" required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" required />
        <button type="submit">Agregar</button>
      </form>
      {msg && <p>{msg}</p>}
      <ul>
        {items.map((it, i) => (
          <li key={i}>{String(it.date)} - {String(it.amount)} - {it.description} ({it.kind})</li>
        ))}
      </ul>
    </div>
  )
}
