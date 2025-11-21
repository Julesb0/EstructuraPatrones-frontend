import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SocialLoginButtonsProps {
  onSocialLoginSuccess: (user: any, provider: string) => void;
  onSocialLoginError: (error: string) => void;
  mode?: 'login' | 'register';
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  onSocialLoginError,
  mode = 'login' 
}) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'facebook') => {
    setLoading(provider);
    
    try {
      // Configurar redirección según el modo
      const redirectTo = mode === 'register' 
        ? `${window.location.origin}/register-social?provider=${provider}`
        : `${window.location.origin}/auth/callback`;

      // Simular el proceso de autenticación social
      // En producción, esto se conectaría con Supabase o el servicio correspondiente
      console.log(`Iniciando login con ${provider}, redirigiendo a: ${redirectTo}`);
      
      // Simular un pequeño delay para la experiencia de usuario
      setTimeout(() => {
        // En producción, aquí iría la lógica real de autenticación
        window.location.href = redirectTo;
      }, 1000);

    } catch (error) {
      console.error(`Error en login con ${provider}:`, error);
      onSocialLoginError(`Error al iniciar sesión con ${provider}. Por favor intenta de nuevo.`);
    } finally {
      setLoading(null);
    }
  };

  const socialProviders = [
    {
      name: 'google',
      label: 'Continuar con Google',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    },
    {
      name: 'microsoft',
      label: 'Continuar con Microsoft',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#f35325" d="M11.4 11.4H0V0h11.4z"/>
          <path fill="#81bc06" d="M24 11.4H12.6V0H24z"/>
          <path fill="#05a6f0" d="M11.4 24H0V12.6h11.4z"/>
          <path fill="#ffba08" d="M24 24H12.6V12.6H24z"/>
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      name: 'facebook',
      label: 'Continuar con Facebook',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => {
        const Icon = provider.icon;
        return (
          <button
            key={provider.name}
            onClick={() => handleSocialLogin(provider.name as any)}
            disabled={loading !== null}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              provider.color
            } ${loading === provider.name ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {loading === provider.name ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <span className="w-5 h-5 mr-3"><Icon /></span>
            )}
            {provider.label}
          </button>
        );
      })}
    </div>
  );
};

export default SocialLoginButtons;