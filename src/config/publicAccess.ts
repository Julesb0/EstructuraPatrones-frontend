// Configuración de acceso público al dashboard
export const PUBLIC_ACCESS_CONFIG = {
  // Habilitar acceso público al dashboard sin autenticación
  enablePublicAccess: true,
  
  // URL de redirección después de login
  redirectAfterLogin: '/dashboard',
  
  // URLs de la aplicación
  appUrl: import.meta.env.VITE_APP_URL || 'https://estructura-patrones-frontend.vercel.app',
  
  // Mensaje para usuarios no autenticados
  guestMessage: 'Estás accediendo como invitado. Algunas funciones pueden estar limitadas.'
};

// Helper para verificar si el usuario puede acceder al dashboard
export const canAccessDashboard = () => {
  return PUBLIC_ACCESS_CONFIG.enablePublicAccess || !!localStorage.getItem('token');
};

// Helper para obtener la URL de redirección correcta
export const getRedirectUrl = () => {
  return PUBLIC_ACCESS_CONFIG.appUrl + PUBLIC_ACCESS_CONFIG.redirectAfterLogin;
};