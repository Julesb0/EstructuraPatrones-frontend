"use client"

import { useEffect, useState } from "react"
import { getPublicProfiles, getAuthUsers, sendConnectionRequest } from "@/lib/api-client"

interface Profile {
  id: string
  userId: string
  email?: string
  bio?: string
  role?: string
}

export default function NetworkingProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [profilesRes, usersResRaw] = await Promise.all([
          getPublicProfiles(),
          getAuthUsers(1, 100),
        ])
        const pList = (profilesRes as any[]) || []
        const uRoot = typeof usersResRaw === "string" ? JSON.parse(usersResRaw) : (usersResRaw as any)
        const uList: any[] = Array.isArray(uRoot) ? uRoot : (Array.isArray(uRoot?.users) ? uRoot.users : [])
        const merged: Profile[] = []
        for (const u of uList) {
          const email = u?.email || u?.user?.email || u?.user_metadata?.email
          const id = u?.id || u?.user?.id || u?.uid
          if (email && id) merged.push({ id, userId: email, email })
        }
        for (const p of pList) {
          if (p?.userId) {
            const existing = merged.find((m) => m.userId === p.userId)
            if (!existing) merged.push({ id: p.id, userId: p.userId, bio: p.bio, role: p.role })
            else {
              existing.bio = p.bio ?? existing.bio
              existing.role = p.role ?? existing.role
            }
          }
        }
        setProfiles(merged)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function onConnect(userId: string) {
    setSendingId(userId)
    setError(null)
    try {
      await sendConnectionRequest(userId)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSendingId(null)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="prose-title mb-2">Perfiles Públicos</h1>
        <p className="prose-subtitle mb-6">Explora y conecta con otros usuarios</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando perfiles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.length === 0 ? (
              <div className="text-muted-foreground">No hay perfiles disponibles</div>
            ) : (
              profiles.map((p) => (
                <div key={p.id} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-sm font-semibold mb-1">{p.email || p.userId}</h3>
                  {p.bio && <p className="text-sm text-muted-foreground mb-2">{p.bio}</p>}
                  {p.role && <div className="text-xs text-muted-foreground mb-4">{p.role}</div>}
                  <div className="flex gap-2">
                    <button onClick={() => onConnect(p.userId)} disabled={sendingId === p.userId} className="btn-primary text-sm">
                      {sendingId === p.userId ? "Enviando..." : "Conectar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
