import { useState, useEffect } from 'react'

export const useSocialAuthTest = () => {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Limpiar errores anteriores al montar el componente
    setError(null)
  }, [])

  return {
    error
  }
}