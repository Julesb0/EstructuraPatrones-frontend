import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postJson } from '../api/client';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import CustomRecaptcha from '../components/auth/CustomRecaptcha';
import { useSocialAuthTest } from '../hooks/useSocialAuthTest';
import { Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { error: socialError } = useSocialAuthTest();

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
      const response = await postJson('/api/auth/login', {
        email,
        password,
        recaptchaToken,
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      navigate('/dashboard');
    } catch (err) {
      setRecaptchaToken(null);
      
      if (err instanceof Error && err.message.includes('reCAPTCHA')) {
        setError('reCAPTCHA inválido. Por favor intenta de nuevo.');
      } else {
        setError('Credenciales inválidas. Por favor intenta de nuevo.');
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
              Plataforma de Emprendedores
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Únete a la comunidad de emprendedores más innovadora. Accede a herramientas de inteligencia artificial, 
              planes de negocio personalizados y asesoramiento experto para hacer crecer tu empresa.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-300">10K+</div>
                <div className="text-sm text-gray-300">Emprendedores</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-cyan-300">500+</div>
                <div className="text-sm text-gray-300">Planes Creados</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm">IA Inteligente</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-sm">Seguridad Avanzada</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                <span className="text-sm">Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
              <p className="text-gray-300">Inicia sesión en tu cuenta</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {socialError && (
              <div className="mb-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-200 text-sm">
                {socialError}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="mb-6">
              <SocialLoginButtons 
                onSocialLoginSuccess={(_user, provider) => {
                  console.log(`Login social exitoso con ${provider}`)
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
                  <span className="px-2 bg-transparent text-gray-400">o continúa con</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-300">
                  <input type="checkbox" className="mr-2 rounded" />
                  Recordarme
                </label>
                <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                  ¿Olvidaste tu contraseña?
                </a>
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
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Iniciar sesión
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 mt-6">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center justify-center mt-1"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;