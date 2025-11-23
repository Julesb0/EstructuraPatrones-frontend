import { useState } from 'react'
import { postJson } from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await postJson<{ token: string; username: string }>(
        '/api/auth/login',
        { email: email.trim(), password: password.trim() }
      )
      localStorage.setItem('token', res.token)
      localStorage.setItem('username', res.username)
      window.location.href = '/welcome'
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
