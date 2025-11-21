import React from 'react'
import { OAuthProvider } from '../../lib/supabaseClient'
import { useSocialAuthTest } from '../../hooks/useSocialAuthTest'
import './SocialLogin.css'

interface SocialLoginButtonsProps {
  onSocialLoginSuccess: (user: any, provider: OAuthProvider) => void
  onSocialLoginError: (error: string) => void
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  onSocialLoginSuccess,
  onSocialLoginError 
}) => {
  const { loading, error, handleSocialLogin } = useSocialAuthTest()

  const handleSocialLoginClick = async (provider: OAuthProvider) => {
    try {
      console.log(`Iniciando login social con ${provider}`)
      setError(null) // Clear previous errors
      await handleSocialLogin(provider)
      console.log(`Login social con ${provider} completado`)
      // Si llegamos aquí, el login fue exitoso
      onSocialLoginSuccess({ email: `testuser@${provider}.com` }, provider)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión social'
      console.error(`Error en login social con ${provider}:`, errorMessage)
      setError(errorMessage)
      onSocialLoginError(errorMessage)
    }
  }

  const handleGoogleLogin = () => handleSocialLoginClick('google')
  const handleFacebookLogin = () => handleSocialLoginClick('facebook')
  const handleMicrosoftLogin = () => handleSocialLoginClick('azure')

  return (
    <div className="social-login-container">
      {error && (
        <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
          {error}
        </div>
      )}
      
      <div className="divider">
        <span>O continúa con</span>
      </div>
      
      <div className="social-buttons">
        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="social-button google"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Procesando...' : 'Continuar con Google'}
        </button>

        <button 
          type="button"
          onClick={handleFacebookLogin}
          className="social-button facebook"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {loading ? 'Procesando...' : 'Continuar con Facebook'}
        </button>

        <button 
          type="button"
          onClick={handleMicrosoftLogin}
          className="social-button microsoft"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#f35325" d="M11.4 11.4H0V0h11.4z"/>
            <path fill="#81bc06" d="M24 11.4H12.6V0H24z"/>
            <path fill="#05a6f0" d="M11.4 24H0V12.6h11.4z"/>
            <path fill="#ffba08" d="M24 24H12.6V12.6H24z"/>
          </svg>
          {loading ? 'Procesando...' : 'Continuar con Microsoft'}
        </button>
      </div>


    </div>
  )
}

export default SocialLoginButtons