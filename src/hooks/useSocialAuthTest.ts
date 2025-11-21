import { useEffect, useState } from 'react'
import { supabase, OAuthProvider, SocialLoginRequest } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface UseSocialAuthReturn {
  loading: boolean
  error: string | null
  handleSocialLogin: (provider: OAuthProvider) => Promise<void>
  handleOAuthCallback: () => Promise<void>
}

export const useSocialAuthTest = (): UseSocialAuthReturn => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSocialLogin = async (provider: OAuthProvider) => {
    try {
      console.log(`Mock social login iniciado para ${provider}`)
      setLoading(true)
      setError(null)

      // Mock OAuth flow - simulate successful OAuth
      const mockEmail = `test_${provider}@example.com`
      console.log(`Email mock generado: ${mockEmail}`)
      
      // Simulate OAuth callback with mock data
      setTimeout(() => {
        console.log(`Ejecutando callback mock para ${provider}`)
        handleOAuthCallbackWithMockData(provider, mockEmail)
      }, 1000)

    } catch (err) {
      console.error(`Error en mock social login:`, err)
      setError('Error al iniciar sesión social')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthCallbackWithMockData = async (provider: OAuthProvider, email: string) => {
    try {
      console.log(`Procesando callback mock para ${provider} con email ${email}`)
      setLoading(true)
      setError(null)

      // Simular respuesta exitosa del backend sin hacer petición real
      const mockResponse = {
        success: true,
        message: 'Mock social login successful',
        token: `mock_jwt_token_${Date.now()}`,
        user: {
          id: `mock_user_${email.hashCode()}`,
          email: email,
          username: email.split('@')[0],
          provider: provider
        }
      }

      console.log(`Respuesta mock generada:`, mockResponse)

      // Guardar token JWT en localStorage
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('username', mockResponse.user.username)
      
      console.log(`Token guardado, redirigiendo al dashboard`)
      
      // Redirigir al dashboard
      navigate('/dashboard')
      
    } catch (err) {
      console.error(`Error en callback mock:`, err)
      setError(err instanceof Error ? err.message : 'Error en el proceso de OAuth')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthCallback = async () => {
    // Este método no se usa en modo de prueba
    console.log('OAuth callback not used in test mode')
  }

  return {
    loading,
    error,
    handleSocialLogin,
    handleOAuthCallback
  }
}