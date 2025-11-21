// Función para testear la conexión con Supabase
import { supabase } from '../lib/supabaseClient';

export const testConnections = async () => {
  console.log('🧪 Iniciando tests de conexión...');
  
  // Test 1: Conexión a Supabase
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
    } else {
      console.log('✅ Conexión a Supabase exitosa');
      console.log('📊 Sesión actual:', data);
    }
  } catch (error) {
    console.error('❌ Error crítico con Supabase:', error);
  }
  
  // Test 2: Conexión al backend
  try {
    const response = await fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:8080'}/health`);
    if (response.ok) {
      console.log('✅ Backend conectado correctamente');
    } else {
      console.error('❌ Backend respondió con error:', response.status);
    }
  } catch (error) {
    console.error('❌ Error conectando al backend:', error);
  }
  
  // Test 3: Verificar variables de entorno
  console.log('🔍 Variables de entorno actuales:');
  console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('- VITE_RECAPTCHA_SITE_KEY:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);
};

// Test 4: Probar registro con Supabase directamente
export const testSupabaseRegister = async (email: string, password: string, username: string) => {
  try {
    console.log('📝 Testeando registro con Supabase...');
    
    // 1. Registrar usuario
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });
    
    if (authError) {
      console.error('❌ Error en registro:', authError.message);
      return { success: false, error: authError.message };
    }
    
    console.log('✅ Registro exitoso:', authData);
    
    // 2. Crear perfil en tabla profiles (si existe)
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: username,
          email: email
        });
      
      if (profileError) {
        console.warn('⚠️ Error creando perfil:', profileError.message);
      } else {
        console.log('✅ Perfil creado exitosamente');
      }
    }
    
    return { success: true, data: authData };
  } catch (error) {
    console.error('❌ Error crítico:', error);
    return { success: false, error: 'Error desconocido' };
  }
};

// Test 5: Probar login con Supabase
export const testSupabaseLogin = async (email: string, password: string) => {
  try {
    console.log('🔐 Testeando login con Supabase...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Error en login:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Login exitoso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error crítico:', error);
    return { success: false, error: 'Error desconocido' };
  }
};