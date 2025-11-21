import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

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
        // Verificar si hay una sesión activa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          // Usuario autenticado, verificar si es nuevo
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (!profile) {
            // Es un usuario nuevo, crear perfil
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
                role: 'ENTREPRENEUR',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (createError) {
              throw createError;
            }

            setStatus('success');
            setMessage('¡Registro completado con éxito! Redirigiendo...');
            
            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            // Usuario existente, redirigir al dashboard
            setStatus('success');
            setMessage('¡Bienvenido de vuelta! Redirigiendo...');
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          }
        } else {
          // No hay sesión, redirigir al login
          setStatus('error');
          setMessage('No se pudo completar el registro. Por favor intenta de nuevo.');
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error en registro social:', error);
        setStatus('error');
        setMessage('Error al procesar el registro. Por favor intenta de nuevo.');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    processSocialRegistration();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Registro con {provider}</h2>
            <p className="text-gray-300">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Éxito!</h2>
            <p className="text-gray-300">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
            <p className="text-gray-300">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialRegister;