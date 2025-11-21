import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson, postJson, BusinessPlan } from '../api/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, Users, FileText, Activity, Plus, X, ArrowRight, 
  Settings, User, LogOut, Menu, Home, Briefcase, BarChart3 
} from 'lucide-react';

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

function DashboardModern() {
  const [, setPlans] = useState<BusinessPlan[]>([]);
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchAnalytics();
    generateMockActivities();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getJson('/api/plans');
      setPlans(data);
      // Calculate stats from actual data
      const completed = data.filter((plan: any) => plan.status === 'completed').length;
      const inProgress = data.filter((plan: any) => plan.status === 'in_progress').length;
      setStats({
        totalPlans: data.length,
        completedPlans: completed,
        inProgressPlans: inProgress,
        recentActivities: Math.floor(data.length * 1.2)
      });
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Use mock data if backend is not available
      setPlans([]);
      setStats({
        totalPlans: 0,
        completedPlans: 0,
        inProgressPlans: 0,
        recentActivities: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const analytics = await getJson('/api/analytics/summary');
      // Update stats with analytics data if available
      if (analytics) {
        setStats(prev => ({
          ...prev,
          totalPlans: analytics.totalPlans || prev.totalPlans,
          completedPlans: analytics.completedPlans || prev.completedPlans,
          inProgressPlans: analytics.inProgressPlans || prev.inProgressPlans,
        }));
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Briefcase, label: 'Planes', path: '/dashboard/plans', active: false },
    { icon: BarChart3, label: 'Análisis', path: '/dashboard/analytics', active: false },
    { icon: User, label: 'Perfil', path: '/dashboard/profile', active: false },
    { icon: Settings, label: 'Configuración', path: '/dashboard/settings', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">HotCash</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                item.active 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg w-full">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white/70 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Plan</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalPlans}</div>
              <div className="text-white/70 text-sm">Planes Totales</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-green-400">✓</div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.completedPlans}</div>
              <div className="text-white/70 text-sm">Completados</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.inProgressPlans}</div>
              <div className="text-white/70 text-sm">En Progreso</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.recentActivities}</div>
              <div className="text-white/70 text-sm">Actividades</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
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
                  <Bar dataKey="plans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Distribución por Estado</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={plansByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {plansByStatus.map((entry, index) => (
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

          {/* Growth Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Crecimiento de la Plataforma</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
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
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} name="Usuarios" />
                <Line type="monotone" dataKey="plans" stroke="#3b82f6" strokeWidth={3} name="Planes" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Actividades Recientes</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    {activity.type === 'plan_created' && <FileText className="w-5 h-5 text-purple-400" />}
                    {activity.type === 'plan_updated' && <Activity className="w-5 h-5 text-blue-400" />}
                    {activity.type === 'profile_updated' && <User className="w-5 h-5 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.description}</p>
                    <small className="text-white/70">{new Date(activity.timestamp).toLocaleString()}</small>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear nuevo plan */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Nuevo Plan de Negocio</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Plan
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mi nuevo plan de negocio"
                />
              </div>
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
                  Resumen
                </label>
                <textarea
                  id="summary"
                  value={newPlan.summary}
                  onChange={(e) => setNewPlan({ ...newPlan, summary: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe tu idea de negocio..."
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
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

export default DashboardModern;