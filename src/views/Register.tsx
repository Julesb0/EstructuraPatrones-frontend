import { useState } from 'react'
import { postJson } from '../api/client'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<boolean>(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOk(false)
    try {
      await postJson('/api/auth/register', { username: username.trim(), email: email.trim(), password: password.trim() })
      setOk(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Crear cuenta</button>
      </form>
      {ok && <p style={{ color: 'green' }}>Usuario registrado correctamente</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
