import React, { useState, useEffect } from 'react';
import AuthTestComponent from '../components/auth/AuthTestComponent';
import { runFullSystemCheck, checkDeploymentStatus } from '../utils/system-check';

const TestPage: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar estado al cargar la página
    checkDeploymentStatus().then(setDeploymentStatus);
  }, []);

  const runFullCheck = async () => {
    setLoading(true);
    const results = await runFullSystemCheck();
    setSystemStatus(results);
    setLoading(false);
  };

  const refreshDeployment = async () => {
    setDeploymentStatus(await checkDeploymentStatus());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Panel de Test de Autenticación
          </h1>
          <p className="text-gray-300">
            Usa este panel para verificar que tu conexión con Supabase esté funcionando correctamente.
          </p>
        </div>

        {/* Estado del Deployment */}
        <div className="mb-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-blue-200 font-medium mb-4">🚀 Estado del Deployment</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Backend URL:</span>
              <span className="font-mono text-sm">{deploymentStatus?.url || 'Verificando...'}</span>
            </div>
            <div className="flex justify-between">
              <span>Estado:</span>
              <span className={deploymentStatus?.success ? 'text-green-400' : 'text-red-400'}>
                {deploymentStatus?.success ? '✅ Conectado' : '❌ Desconectado'}
              </span>
            </div>
            <button 
              onClick={refreshDeployment}
              className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              🔄 Refrescar
            </button>
          </div>
        </div>

        {/* Verificación completa */}
        <div className="mb-8">
          <button 
            onClick={runFullCheck}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium"
          >
            {loading ? '🔄 Verificando...' : '🔍 Verificar Sistema Completo'}
          </button>
          
          {systemStatus && (
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">📊 Resultados:</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(systemStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span className={value ? 'text-green-400' : 'text-red-400'}>
                      {value ? '✅ OK' : '❌ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <AuthTestComponent />
        
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h3 className="text-yellow-200 font-medium mb-2">📋 Configuración actual:</h3>
          <div className="text-yellow-100 text-sm space-y-1">
            <p>✅ Frontend: https://estructura-patrones-frontend-ljgk.vercel.app</p>
            <p>🔄 Backend: {deploymentStatus?.success ? '✅ Conectado' : '❌ Pendiente de URL'}</p>
            <p>🔄 Supabase: Configurado con credenciales</p>
            <p>⏳ Google Login: URLs configuradas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;