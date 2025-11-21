import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { completeSocialAuth } from '../lib/socialAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { PUBLIC_ACCESS_CONFIG } from '../config/publicAccess'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Si el usuario ya está autenticado, redirigir al dashboard
        if (user) {
          navigate('/dashboard')
          return
        }

        // Completar el proceso de autenticación social
        const result = await completeSocialAuth()
        
        if (result.success && result.user && result.token) {
          // Guardar en localStorage
          localStorage.setItem('token', result.token)
          localStorage.setItem('username', result.user.username)
          localStorage.setItem('email', result.user.email)
          
          // Redirigir al dashboard
          navigate('/dashboard')
        } else {
          // Si hay error, ir al login
          navigate('/login?error=oauth_failed')
        }
      } catch (error) {
        console.error('Error en el callback de autenticación:', error)
        navigate('/login?error=callback_error')
      }
    }

    if (!isLoading) {
      handleCallback()
    }
  }, [navigate, user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Completando autenticación..." size="lg" />
      </div>
    )
  }

  // Si llegamos aquí, el efecto ya debería haber redirigido
  return null
}

export default AuthCallback