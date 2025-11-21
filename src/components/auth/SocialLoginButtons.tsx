import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft, SiFacebook } from 'react-icons/si';
import { Loader2 } from 'lucide-react';

interface SocialLoginButtonsProps {
  onSocialLoginSuccess: (user: any, provider: string) => void;
  onSocialLoginError: (error: string) => void;
  mode?: 'login' | 'register';
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  onSocialLoginSuccess, 
  onSocialLoginError,
  mode = 'login' 
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'facebook') => {
    setLoading(provider);
    
    try {
      // Configurar redirección según el modo
      const redirectTo = mode === 'register' 
        ? `${window.location.origin}/register-social?provider=${provider}`
        : `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      // Si hay URL de redirección, navegar allí
      if (data.url) {
        window.location.href = data.url;
      }

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
      icon: FcGoogle,
      color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    },
    {
      name: 'microsoft',
      label: 'Continuar con Microsoft',
      icon: SiMicrosoft,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      name: 'facebook',
      label: 'Continuar con Facebook',
      icon: SiFacebook,
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
              <Icon className="w-5 h-5 mr-3" />
            )}
            {provider.label}
          </button>
        );
      })}
    </div>
  );
};

export default SocialLoginButtons;