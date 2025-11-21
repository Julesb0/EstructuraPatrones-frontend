import { supabase } from '../lib/supabaseClient'
import { postJson } from '../api/client'

export interface SocialAuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    username: string
  }
  token?: string
  error?: string
}

export const handleSocialAuth = async (provider: 'google'): Promise<SocialAuthResponse> => {
  try {
    // Iniciar el flujo de OAuth con Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Error en autenticación social:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Si hay URL de redirección, el usuario necesita completar el flujo en la página de OAuth
    if (data?.url) {
      // Guardar el provider temporalmente
      sessionStorage.setItem('oauth_provider', provider)
      
      // Redirigir a la página de OAuth
      window.location.href = data.url
      
      return {
        success: true,
        user: undefined, // El usuario se establecerá después del callback
        token: undefined // El token se establecerá después del callback
      }
    }

    return {
      success: false,
      error: 'No se pudo iniciar el flujo de autenticación'
    }
  } catch (error) {
    console.error('Error en handleSocialAuth:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export const completeSocialAuth = async (): Promise<SocialAuthResponse> => {
  try {
    // Obtener la sesión actual de Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return {
        success: false,
        error: 'No se pudo obtener la sesión de autenticación'
      }
    }

    // Obtener los datos del usuario
    const { user } = session
    const token = session.access_token

    if (!user || !token) {
      return {
        success: false,
        error: 'Datos de autenticación incompletos'
      }
    }

    // Intercambiar el token de Supabase por un JWT de la app en el backend
    try {
      const backendResponse = await postJson('/api/auth/social-login', {
        accessToken: token,
        email: user.email,
        provider: 'google'
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email!,
          username: backendResponse.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'usuario'
        },
        token: backendResponse.token || token
      }
    } catch (backendError) {
      console.error('Error en social-login backend:', backendError)
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email!,
          username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'usuario'
        },
        token: token
      }
    }
  } catch (error) {
    console.error('Error en completeSocialAuth:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error)
    }
  } catch (error) {
    console.error('Error en signOut:', error)
  }
}
