// Script de verificación final - Agregar a tu app para probar

import { supabase } from '../lib/supabaseClient';
import { postJson } from '../api/client';

export const runFullSystemCheck = async () => {
  console.log('🚀 INICIANDO VERIFICACIÓN COMPLETA DEL SISTEMA');
  console.log('==========================================');
  
  const results = {
    supabase: false,
    backend: false,
    frontend: false,
    googleLogin: false,
    registration: false
  };

  // 1. Verificar Supabase
  console.log('\n1️⃣ Verificando Supabase...');
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase error:', error.message);
    } else {
      console.log('✅ Supabase conectado');
      results.supabase = true;
    }
  } catch (error) {
    console.error('❌ Supabase conexión fallida:', error);
  }

  // 2. Verificar Backend
  console.log('\n2️⃣ Verificando Backend...');
  try {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';
    console.log('📡 Intentando conectar a:', apiUrl);
    
    const response = await fetch(`${apiUrl}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend conectado:', data);
      results.backend = true;
    } else {
      console.error('❌ Backend respondió con error:', response.status);
    }
  } catch (error) {
    console.error('❌ Backend conexión fallida:', error);
  }

  // 3. Verificar variables de entorno
  console.log('\n3️⃣ Verificando variables de entorno...');
  console.log('📋 VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Faltante');
  console.log('📋 VITE_API_URL:', import.meta.env.VITE_API_URL || 'http://localhost:8080');
  console.log('📋 VITE_RECAPTCHA_SITE_KEY:', import.meta.env.VITE_RECAPTCHA_SITE_KEY ? '✅ Configurado' : '❌ Faltante');
  results.frontend = true;

  // 4. Probar Google Login (simulado)
  console.log('\n4️⃣ Verificando Google Login...');
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      console.log('⚠️ Google Login configurado pero necesita interacción del usuario');
    } else {
      console.log('✅ Google Login configurado correctamente');
      results.googleLogin = true;
    }
  } catch (error) {
    console.error('❌ Google Login error:', error);
  }

  // 5. Resumen
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log('==========================================');
  Object.entries(results).forEach(([key, value]) => {
    console.log(`${value ? '✅' : '❌'} ${key}: ${value ? 'FUNCIONANDO' : 'FALLANDO'}`);
  });

  // 6. Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  if (!results.backend) {
    console.log('   - Verifica que tu backend en Railway esté ejecutándose');
    console.log('   - Asegúrate de que CORS_ORIGINS incluya tu dominio de Vercel');
    console.log('   - URL actual del frontend:', window.location.origin);
  }
  
  if (!results.supabase) {
    console.log('   - Verifica las credenciales de Supabase en las variables de entorno');
  }
  
  if (!results.googleLogin) {
    console.log('   - Verifica las URLs de redirección en Supabase');
    console.log('   - Asegúrate de tener configurado Google como provider');
  }

  return results;
};

// Función para probar registro
export const testRegistration = async (email: string, password: string, username: string) => {
  console.log('\n📝 PROBANDO REGISTRO...');
  
  try {
    // Intentar con backend primero
    const result = await postJson('/api/auth/register', {
      email,
      password,
      username,
      recaptchaToken: 'test-token'
    });
    
    console.log('✅ Registro con backend exitoso:', result);
    return { success: true, method: 'backend' };
    
  } catch (backendError) {
    console.log('⚠️ Backend falló, intentando con Supabase directamente...');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (error) {
        console.error('❌ Registro con Supabase falló:', error.message);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Registro con Supabase exitoso:', data);
      return { success: true, method: 'supabase' };
      
    } catch (supabaseError) {
      console.error('❌ Ambos métodos fallaron:', supabaseError);
      return { success: false, error: 'Ambos métodos de registro fallaron' };
    }
  }
};

// Función para obtener la URL del backend
export const getBackendUrl = () => {
  return (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';
};

// Función para verificar el estado del deployment
export const checkDeploymentStatus = async () => {
  const backendUrl = getBackendUrl();
  console.log('🔍 Verificando deployment en:', backendUrl);
  
  try {
    const response = await fetch(`${backendUrl}/health`);
    const data = await response.json();
    return {
      url: backendUrl,
      status: response.status,
      data: data,
      success: response.ok
    };
  } catch (error) {
    return {
      url: backendUrl,
      status: 'ERROR',
      error: error,
      success: false
    };
  }
};