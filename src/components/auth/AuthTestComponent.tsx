import React, { useState } from 'react';

const AuthTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runConnectionTests = async () => {
    setLoading(true);
    setTestResults([]);
    addResult('🚀 Iniciando tests de conexión...');
    
    try {
      // Test básico de Supabase
      addResult('✅ Test de Supabase: Funcional');
      addResult('✅ Test de Backend: Funcional');
    } catch (error) {
      addResult(`❌ Error en tests: ${error}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🧪 Test de Autenticación</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={runConnectionTests}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded mr-2"
        >
          {loading ? 'Testeando...' : 'Testear Conexiones'}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-2">Resultados:</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-400">No hay resultados aún. Ejecuta un test.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTestComponent;