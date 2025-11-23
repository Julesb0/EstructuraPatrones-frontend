"use client"

import { useEffect, useState } from "react"
import { getProfile, upsertProfile } from "@/lib/api-client"

interface Profile {
  id?: string
  userId: string
  bio?: string
  role?: string
  skills?: string[]
}

export default function NetworkingProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const p = await getProfile()
        setProfile(p as Profile)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
        const payload = {
          bio: profile.bio || "",
          role: profile.role || "",
          skills: (profile.skills || []).filter((s) => s && s.trim() !== ""),
        }
      const res = await upsertProfile(payload)
      setProfile({
        ...profile,
        ...(res as any),
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="prose-title mb-2">Mi Perfil</h1>
        <p className="prose-subtitle mb-6">Configura tu perfil público</p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando perfil...</p>
          </div>
        ) : (
        <form onSubmit={onSubmit} className="space-y-4 bg-card rounded-lg p-6 border border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field w-full h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
                <input
                  type="text"
                  value={profile.role || ""}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="input-field w-full"
                  placeholder="ej. developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Skills (separadas por coma)</label>
                <input
                  type="text"
                  value={(profile.skills || []).join(", ")}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className="input-field w-full"
                  placeholder="React, Spring, SQL"
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary font-medium">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
