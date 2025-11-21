import { useState, useEffect } from 'react';
import { getJson } from '../api/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, Check } from 'lucide-react';

interface AnalyticsData {
  totalPlans: number;
  completedPlans: number;
  inProgressPlans: number;
  successRate: number;
  estimatedRevenue: number;
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPlans: 0,
    completedPlans: 0,
    inProgressPlans: 0,
    successRate: 0,
    estimatedRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getJson('/api/analytics/summary');
      setAnalytics(data);
    } catch (err) {
      setError('Error al cargar los análisis');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (can be enhanced with real data later)
  const plansByMonth = [
    { month: 'Ene', plans: 2, completed: 1 },
    { month: 'Feb', plans: 5, completed: 2 },
    { month: 'Mar', plans: 3, completed: 2 },
    { month: 'Abr', plans: 8, completed: 4 },
    { month: 'May', plans: 6, completed: 3 },
    { month: 'Jun', plans: 9, completed: 5 }
  ];

  const statusData = [
    { name: 'Completados', value: analytics.completedPlans, color: '#10b981' },
    { name: 'En Progreso', value: analytics.inProgressPlans, color: '#f59e0b' },
    { name: 'Pendientes', value: Math.max(0, analytics.totalPlans - analytics.completedPlans - analytics.inProgressPlans), color: '#3b82f6' }
  ];

  const revenueData = [
    { month: 'Ene', revenue: 5000 },
    { month: 'Feb', revenue: 12000 },
    { month: 'Mar', revenue: 8000 },
    { month: 'Abr', revenue: 20000 },
    { month: 'May', revenue: 15000 },
    { month: 'Jun', revenue: 25000 }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-500 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          Cargando análisis...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Análisis de Negocios</h1>
          <button 
            onClick={fetchAnalytics}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Actualizar
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{analytics.totalPlans}</div>
            <div className="text-gray-300 text-sm">Planes Totales</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{analytics.completedPlans}</div>
            <div className="text-gray-300 text-sm">Planes Completados</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{analytics.successRate.toFixed(1)}%</div>
            <div className="text-gray-300 text-sm">Tasa de Éxito</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              {analytics.estimatedRevenue > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-white mb-1">${analytics.estimatedRevenue.toLocaleString()}</div>
            <div className="text-gray-300 text-sm">Ingresos Estimados</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Planes por Mes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={plansByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #ffffff20', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="plans" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Completados" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Distribución por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #ffffff20', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Ingresos Estimados por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="month" stroke="#ffffff70" />
              <YAxis stroke="#ffffff70" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #ffffff20', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3} 
                name="Ingresos"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Insights</h3>
          <div className="space-y-3 text-gray-300">
            {analytics.totalPlans > 0 && analytics.successRate > 50 && (
              <p className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span>¡Excelente tasa de éxito! Estás por encima del promedio del sector.</span>
              </p>
            )}
            {analytics.totalPlans > 0 && analytics.successRate < 30 && (
              <p className="flex items-start space-x-2">
                <span className="text-yellow-400">⚠</span>
                <span>Considera revisar tu estrategia para mejorar tu tasa de éxito.</span>
              </p>
            )}
            {analytics.estimatedRevenue > 20000 && (
              <p className="flex items-start space-x-2">
                <span className="text-green-400">✓</span>
                <span>Tus ingresos estimados están creciendo de manera saludable.</span>
              </p>
            )}
            {analytics.totalPlans === 0 && (
              <p className="flex items-start space-x-2">
                <span className="text-blue-400">ℹ</span>
                <span>Comienza creando tu primer plan de negocio para ver análisis detallados.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;