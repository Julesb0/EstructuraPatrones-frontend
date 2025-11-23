import { API_BASE } from './client'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return token ? ({ Authorization: `Bearer ${token}` } as Record<string, string>) : ({} as Record<string, string>)
}

export async function addIncome(payload: { amount: number; date: string; description: string; userEmail: string }) {
  const res = await fetch(`${API_BASE}/api/finance/incomes`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function addExpense(payload: { amount: number; type: string; date: string; description: string; recurring: boolean; userEmail: string }) {
  const res = await fetch(`${API_BASE}/api/finance/expenses`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function addMicro(payload: { amount: number; date: string; description: string; userEmail: string }) {
  const res = await fetch(`${API_BASE}/api/finance/microexpenses`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getDashboard(params: { userEmail: string; year: number; month: number }) {
  const u = new URL(`${API_BASE}/api/finance/dashboard`)
  u.searchParams.set('userEmail', params.userEmail)
  u.searchParams.set('year', String(params.year))
  u.searchParams.set('month', String(params.month))
  const res = await fetch(u.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getTransactions(userEmail: string) {
  const u = new URL(`${API_BASE}/api/finance/transactions`)
  u.searchParams.set('userEmail', userEmail)
  const res = await fetch(u.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getNimAi(params: { userEmail: string; year: number; month: number }) {
  const u = new URL(`${API_BASE}/api/finance/nimai`)
  u.searchParams.set('userEmail', params.userEmail)
  u.searchParams.set('year', String(params.year))
  u.searchParams.set('month', String(params.month))
  const res = await fetch(u.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getNimAi6(params: { userEmail: string; year: number; month: number }) {
  const u = new URL(`${API_BASE}/api/finance/nimai6`)
  u.searchParams.set('userEmail', params.userEmail)
  u.searchParams.set('year', String(params.year))
  u.searchParams.set('month', String(params.month))
  const res = await fetch(u.toString(), { headers: authHeaders() })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
