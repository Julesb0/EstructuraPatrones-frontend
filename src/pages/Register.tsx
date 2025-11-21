import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postJson } from '../api/client';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import CustomRecaptcha from '../components/auth/CustomRecaptcha';
import { Mail, Lock, User, UserPlus, ArrowRight, Check } from 'lucide-react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { login } = useAuth();

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!recaptchaToken) {
      setError('Por favor completa el reCAPTCHA');
      return;
    }
    
    setLoading(true);

    try {
      await postJson('/api/auth/register', {
        email,
        password,
        username,
        recaptchaToken,
      });

      // Auto-login después del registro exitoso
      await login(email, password, recaptchaToken);
    } catch (err) {
      setRecaptchaToken(null);
      
      if (err instanceof Error && err.message.includes('reCAPTCHA')) {
        setError('reCAPTCHA inválido. Por favor intenta de nuevo.');
      } else {
        setError('Error al registrar. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl flex items-center justify-between relative z-10">
        {/* Left side - Hero content */}
        <div className="flex-1 mr-12">
          <div className="text-white max-w-lg">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              HotCash
            </h1>
            <h2 className="text-3xl font-semibold mb-4 text-purple-200">
              Únete ahora
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Comienza tu viaje emprendedor con nuestra plataforma inteligente. 
              Crea planes de negocio, obtén asesoramiento de IA y conecta con otros emprendedores.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span>Asesoramiento de IA personalizado</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span>Planes de negocio profesionales</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span>Comunidad de emprendedores</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span>Seguridad avanzada</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Register form */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Crear cuenta</h2>
              <p className="text-gray-300">Comienza tu viaje emprendedor</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Social Register Buttons */}
            <div className="mb-6">
              <SocialLoginButtons 
                onSocialLoginSuccess={(_user, provider) => {
                  console.log(`Registro social exitoso con ${provider}`)
                }}
                onSocialLoginError={(error) => {
                  setError(error)
                }}
              />
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">o regístrate con email</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="tu_usuario"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="py-2">
                <CustomRecaptcha
                  onChange={handleRecaptchaChange}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !recaptchaToken}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Crear cuenta
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
