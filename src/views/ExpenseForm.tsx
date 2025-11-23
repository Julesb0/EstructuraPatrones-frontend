import { useState } from 'react'
import { addExpense, getTransactions } from '../api/finance'

export default function ExpenseForm() {
  const userEmail = localStorage.getItem('username') || ''
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Alimentación')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const saved = await addExpense({ amount: Number(amount), type, date, description, recurring, userEmail })
      setMsg('Gasto registrado')
      const list = await getTransactions(userEmail)
      setItems(list)
    } catch (err: any) {
      setMsg(err.message)
    }
  }

  return (
    <div>
      <h2>Registrar Gasto</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Monto" required />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option>Vivienda</option>
          <option>Alimentación</option>
          <option>Transporte</option>
          <option>Entretenimiento</option>
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" required />
        <label><input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} /> Recurrente</label>
        <button type="submit">Agregar</button>
      </form>
      {msg && <p>{msg}</p>}
      <ul>
        {items.map((it, i) => (
          <li key={i}>{String(it.date)} - {String(it.amount)} - {it.description} ({it.kind}:{it.type}{it.recurring ? ', recurrente' : ''})</li>
        ))}
      </ul>
    </div>
  )
}
