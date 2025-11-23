"use client"

import { useEffect, useState } from "react"
import { getConnections, getPendingConnections, getAcceptedConnections, acceptConnection, rejectConnection, sendConnectionRequest } from "@/lib/api-client"

interface Connection {
  id: string
  requesterId: string
  addresseeId: string
  status: string
  message?: string
}

export default function NetworkingConnectionsPage() {
  const [pending, setPending] = useState<Connection[]>([])
  const [accepted, setAccepted] = useState<Connection[]>([])
  const [all, setAll] = useState<Connection[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [addresseeId, setAddresseeId] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const [p, a, c] = await Promise.all([
        getPendingConnections(),
        getAcceptedConnections(),
        getConnections(),
      ])
      setPending(p as Connection[])
      setAccepted(a as Connection[])
      setAll(c as Connection[])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function onAccept(id: string) {
    try {
      await acceptConnection(id)
      await refresh()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function onReject(id: string) {
    try {
      await rejectConnection(id)
      await refresh()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      await sendConnectionRequest(addresseeId.trim(), message.trim() || undefined)
      setAddresseeId("")
      setMessage("")
      await refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="prose-title mb-2">Conexiones</h1>
        <p className="prose-subtitle mb-6">Gestiona tus solicitudes y contactos</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={onSend} className="bg-card rounded-lg p-6 border border-border mb-8 grid gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Usuario destino</label>
            <input
              type="text"
              value={addresseeId}
              onChange={(e) => setAddresseeId(e.target.value)}
              required
              className="input-field w-full"
              placeholder="ID de usuario o email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mensaje</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field w-full"
              placeholder="Hola, me gustaría conectar"
            />
          </div>
          <button type="submit" disabled={sending} className="btn-primary font-medium">
            {sending ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando conexiones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="bg-card rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold">Pendientes</h2>
              </div>
              <ul>
                {pending.length === 0 ? (
                  <li className="p-4 text-muted-foreground">Sin solicitudes pendientes</li>
                ) : (
                  pending.map((c) => (
                    <li key={c.id} className="p-4 flex items-center justify-between gap-4 border-t border-border">
                      <div>
                        <p className="text-sm font-medium">{c.requesterId} ➜ {c.addresseeId}</p>
                        {c.message && <p className="text-xs text-muted-foreground">{c.message}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => onAccept(c.id)} className="btn-primary text-sm">Aceptar</button>
                        <button onClick={() => onReject(c.id)} className="btn-primary bg-destructive text-destructive-foreground text-sm">Rechazar</button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="bg-card rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold">Aceptadas</h2>
              </div>
              <ul>
                {accepted.length === 0 ? (
                  <li className="p-4 text-muted-foreground">Sin conexiones aceptadas</li>
                ) : (
                  accepted.map((c) => (
                    <li key={c.id} className="p-4 border-t border-border">
                      <p className="text-sm font-medium">{c.requesterId} ⇄ {c.addresseeId}</p>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="bg-card rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold">Todas</h2>
              </div>
              <ul>
                {all.length === 0 ? (
                  <li className="p-4 text-muted-foreground">Sin conexiones</li>
                ) : (
                  all.map((c) => (
                    <li key={c.id} className="p-4 border-t border-border">
                      <p className="text-sm">{c.requesterId} ➜ {c.addresseeId} · {c.status}</p>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

