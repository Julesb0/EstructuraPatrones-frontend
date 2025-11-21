
import { useNavigate } from 'react-router-dom'
import { postJson } from '../api/client'

interface UseAuthReturn {
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()

  const login = async (email: string, password: string, recaptchaToken: string) => {
    const response = await postJson('/api/auth/login', {
      email,
      password,
      recaptchaToken,
    })

    localStorage.setItem('token', response.token)
    localStorage.setItem('username', response.username)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  return {
    login,
    logout,
    isAuthenticated
  }
}

export default useAuth