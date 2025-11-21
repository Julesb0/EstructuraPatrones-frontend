import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

const SocialRegister: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando tu registro...');
  const [provider, setProvider] = useState<string>('');

  useEffect(() => {
    const processSocialRegistration = async () => {
      const providerParam = searchParams.get('provider');
      setProvider(providerParam || 'social');

      try {
        // Simular el proceso de registro social
        // En producción, aquí iría la lógica real de autenticación con Supabase
        console.log(`Procesando registro con ${providerParam}`);
        
        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar si hay token en localStorage (simulando autenticación)
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        if (token && username) {
          // Usuario ya autenticado, redirigir al dashboard
          setStatus('success');
          setMessage('¡Registro exitoso! Redirigiendo al dashboard...');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          // Simular éxito de registro
          setStatus('success');
          setMessage('¡Cuenta creada exitosamente! Redirigiendo...');
          
          // Simular guardar datos de usuario
          localStorage.setItem('token', 'social-auth-token');
          localStorage.setItem('username', `user_${Date.now()}`);
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }

      } catch (error) {
        console.error('Error en registro social:', error);
        setStatus('error');
        setMessage('Error al procesar tu registro. Por favor intenta de nuevo.');
        
        setTimeout(() => {
          navigate('/register');
        }, 3000);
      }
    };

    processSocialRegistration();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' && 'Procesando Registro'}
            {status === 'success' && '¡Registro Exitoso!'}
            {status === 'error' && 'Error en Registro'}
          </h2>
          
          <p className="text-gray-300 mb-6">{message}</p>
          
          {status === 'loading' && (
            <div className="space-y-2">
              <div className="text-sm text-gray-400">
                Procesando autenticación con {provider || 'proveedor social'}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                Preparando tu dashboard personalizado...
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full animate-pulse" style={{width: '80%'}}></div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                Redirigiendo a la página de registro...
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '40%'}}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialRegister;