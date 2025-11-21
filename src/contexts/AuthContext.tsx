import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJson } from '../api/client';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, recaptchaToken: string) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    const checkAuth = async () => {
      try {
        // Primero verificar si hay datos en localStorage (nuestro sistema)
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        
        if (token && username && email) {
          setUser({
            id: username,
            email,
            username
          });
        } else {
          // Si no hay datos en localStorage, verificar Supabase
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Si hay sesión en Supabase, sincronizar con nuestro sistema
            const userData = {
              id: session.user.id,
              email: session.user.email!,
              username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'usuario'
            };
            
            setUser(userData);
            localStorage.setItem('token', session.access_token);
            localStorage.setItem('username', userData.username);
            localStorage.setItem('email', userData.email);
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios en la autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'usuario'
        };
        
        setUser(userData);
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('email', userData.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, recaptchaToken: string) => {
    try {
      const response = await postJson('/api/auth/login', {
        email,
        password,
        recaptchaToken,
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username || email);
        localStorage.setItem('email', email);
        
        setUser({
          id: response.username || email,
          email,
          username: response.username || email
        });
        
        navigate('/dashboard');
      } else {
        throw new Error('No se recibió token de autenticación');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const socialLogin = async (provider: string) => {
    try {
      // Iniciar el flujo de OAuth con Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Redirigir a la página de OAuth
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error en login social:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Cerrar sesión en Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión en Supabase:', error);
    }
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      socialLogin,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};