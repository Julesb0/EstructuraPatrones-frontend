import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson, postJson, BusinessPlan } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardStats {
  totalPlans: number;
  completedPlans: number;
  inProgressPlans: number;
  recentActivities: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

function Dashboard() {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPlans: 0,
    completedPlans: 0,
    inProgressPlans: 0,
    recentActivities: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: '', summary: '' });

  useEffect(() => {
    fetchPlans();
    generateMockActivities();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getJson('/api/plans');
      setPlans(data);
      setStats({
        totalPlans: data.length,
        completedPlans: Math.floor(data.length * 0.3),
        inProgressPlans: Math.floor(data.length * 0.7),
        recentActivities: Math.floor(data.length * 1.2)
      });
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivities = () => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'plan_created',
        description: 'Nuevo plan de negocio creado: "App de Delivery"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        type: 'profile_updated',
        description: 'Perfil actualizado con nueva información de contacto',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: '3',
        type: 'plan_updated',
        description: 'Plan "E-commerce Eco-friendly" actualizado',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
      }
    ];
    setActivities(mockActivities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postJson('/api/plans', newPlan);
      setNewPlan({ title: '', summary: '' });
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  // Datos para gráficos
  const plansByMonth = [
    { month: 'Ene', plans: 2 },
    { month: 'Feb', plans: 5 },
    { month: 'Mar', plans: 3 },
    { month: 'Abr', plans: 8 },
    { month: 'May', plans: 6 },
    { month: 'Jun', plans: 9 }
  ];

  const plansByStatus = [
    { name: 'Completados', value: stats.completedPlans, color: '#10b981' },
    { name: 'En Progreso', value: stats.inProgressPlans, color: '#f59e0b' },
    { name: 'Nuevos', value: stats.totalPlans - stats.completedPlans - stats.inProgressPlans, color: '#3b82f6' }
  ];

  const growthData = [
    { month: 'Ene', users: 10, plans: 5 },
    { month: 'Feb', users: 25, plans: 12 },
    { month: 'Mar', users: 45, plans: 18 },
    { month: 'Abr', users: 70, plans: 25 },
    { month: 'May', users: 95, plans: 32 },
    { month: 'Jun', users: 120, plans: 40 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/dashboard/profile" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Ver Perfil
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={() => setShowForm(true)}>
            Nuevo Plan de Negocio
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalPlans}</h3>
              <p className="text-gray-600">Planes Totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.completedPlans}</h3>
              <p className="text-gray-600">Planes Completados</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-4">🔄</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.inProgressPlans}</h3>
              <p className="text-gray-600">En Progreso</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{stats.recentActivities}</h3>
              <p className="text-gray-600">Actividades Recientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Planes por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plansByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="plans" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={plansByStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
              >
                {plansByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de crecimiento */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Crecimiento de la Plataforma</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#10b981" name="Usuarios" />
            <Line type="monotone" dataKey="plans" stroke="#3b82f6" name="Planes" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Actividades recientes */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Actividades Recientes</h3>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mr-4">
                {activity.type === 'plan_created' && '📋'}
                {activity.type === 'plan_updated' && '✏️'}
                {activity.type === 'profile_updated' && '👤'}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.description}</p>
                <small>{new Date(activity.timestamp).toLocaleString()}</small>
              </div>
            </div>
          ))}
      </div>
    </div>
      </div>

      {/* Lista de planes */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Planes de Negocio</h3>
        {plans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No tienes planes de negocio aún.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={() => setShowForm(true)}>
              Crear tu primer plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h4>
                <p className="text-gray-600 mb-4">{plan.summary}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <small>Creado: {new Date(plan.createdAt).toLocaleDateString()}</small>
                  <small>Actualizado: {new Date(plan.updatedAt).toLocaleDateString()}</small>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">Ver Detalles</button>
                  <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm transition-colors">Editar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear nuevo plan */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Nuevo Plan de Negocio</h3>
              <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Título del Plan</label>
                <input
                  type="text"
                  id="title"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">Resumen</label>
                <textarea
                  id="summary"
                  value={newPlan.summary}
                  onChange={(e) => setNewPlan({ ...newPlan, summary: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1">
                  Crear Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;