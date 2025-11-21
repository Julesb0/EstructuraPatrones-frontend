import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import '../components/auth/SocialLogin.css'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Manejar el callback de OAuth
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error en callback OAuth:', error)
          navigate('/login?error=oauth_failed')
          return
        }

        if (data.session) {
          // El hook useSocialAuth manejará el resto del flujo
          // Por ahora, redirigimos al dashboard
          navigate('/dashboard')
        } else {
          navigate('/login?error=no_session')
        }
      } catch (error) {
        console.error('Error manejando callback:', error)
        navigate('/login?error=callback_error')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="auth-callback-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <h2>Procesando autenticación...</h2>
        <p>Por favor espera mientras completamos el inicio de sesión.</p>
      </div>


    </div>
  )
}

export default AuthCallback