import { useEffect, useState } from 'react'
import { supabase, OAuthProvider, SocialLoginRequest } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface UseSocialAuthReturn {
  loading: boolean
  error: string | null
  handleSocialLogin: (provider: OAuthProvider) => Promise<void>
  handleOAuthCallback: () => Promise<void>
}

export const useSocialAuth = (): UseSocialAuthReturn => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSocialLogin = async (provider: OAuthProvider) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
        return
      }

      // El flujo continuará por redirect
    } catch (err) {
      setError('Error al iniciar sesión social')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthCallback = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        setError('No se pudo obtener la sesión de OAuth')
        return
      }

      // Preparar datos para el backend
      const socialLoginData: SocialLoginRequest = {
        accessToken: session.access_token,
        email: session.user?.email || '',
        provider: session.user?.app_metadata?.provider as OAuthProvider || 'google'
      }

      // Enviar al backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/social-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLoginData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login social')
      }

      // Guardar token JWT en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      
      // Redirigir al dashboard
      navigate('/dashboard')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el proceso de OAuth')
    } finally {
      setLoading(false)
    }
  }

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // El usuario se ha autenticado con OAuth
        await handleOAuthCallback()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return {
    loading,
    error,
    handleSocialLogin,
    handleOAuthCallback
  }
}