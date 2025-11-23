export const API_BASE = (import.meta.env.VITE_API_BASE ?? '')

export async function postJson<T>(path: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error' }))
    const details = Array.isArray(err.fieldErrors)
      ? ': ' + err.fieldErrors.map((fe: any) => `${fe.field} ${fe.message}`).join(', ')
      : ''
    throw new Error((err.error || 'Error') + details)
  }
  return res.json()
}
