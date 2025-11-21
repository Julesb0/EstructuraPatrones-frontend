
import { useNavigate } from 'react-router-dom'
import { postJson } from '../api/client'

interface User {
  id: string
  email: string
  username: string
}

interface UseAuthReturn {
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  user: User | null
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()

  const getUser = (): User | null => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const email = localStorage.getItem('email')
    
    if (!token || !username || !email) return null
    
    return {
      id: username, // Usamos username como ID temporalmente
      email,
      username
    }
  }

  const login = async (email: string, password: string, recaptchaToken: string) => {
    const response = await postJson('/api/auth/login', {
      email,
      password,
      recaptchaToken,
    })

    localStorage.setItem('token', response.token)
    localStorage.setItem('username', response.username)
    localStorage.setItem('email', email)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    navigate('/login')
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  return {
    login,
    logout,
    isAuthenticated,
    user: getUser()
  }
}

export default useAuth