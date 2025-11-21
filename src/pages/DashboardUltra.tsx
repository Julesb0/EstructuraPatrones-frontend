import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BusinessPlan, getJson } from '../api/client';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, FileText, Activity, Plus, ArrowRight, 
  Settings, User, LogOut, Menu, Home, Briefcase, BarChart3, 
  DollarSign, Target, Award, Zap, Star, Eye, Edit3, Trash2
} from 'lucide-react';

interface DashboardStats {
  totalPlans: number;
  completedPlans: number;
  inProgressPlans: number;
  recentActivities: number;
  totalRevenue: number;
  activeUsers: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  color: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
}

function DashboardUltra() {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPlans: 0,
    completedPlans: 0,
    inProgressPlans: 0,
    recentActivities: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch business plans from backend
      const plansData = await getJson('/api/business-plans');
      setPlans(plansData);

      // Fetch analytics from backend
      const analyticsData = await getJson('/api/analytics/summary');
      
      // Update stats with backend data
      setStats({
        totalPlans: analyticsData.totalPlans || plansData.length,
        completedPlans: analyticsData.completedPlans || 0,
        inProgressPlans: analyticsData.inProgressPlans || plansData.length,
        recentActivities: analyticsData.totalPlans || plansData.length,
        totalRevenue: analyticsData.estimatedRevenue || 0,
        activeUsers: 1 // Current user
      });

      // Generate mock activities for now (can be enhanced later)
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'plan_created',
          description: '¡Felicidades! Has creado un nuevo plan de negocio',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          icon: FileText,
          color: 'text-blue-400'
        },
        {
          id: '2',
          type: 'milestone_reached',
          description: '¡Meta alcanzada! Has completado planes de negocio',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          icon: Target,
          color: 'text-green-400'
        }
      ];
      setActivities(mockActivities);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data if backend is not available
      setPlans([]);
      setStats({
        totalPlans: 0,
        completedPlans: 0,
        inProgressPlans: 0,
        recentActivities: 0,
        totalRevenue: 0,
        activeUsers: 1
      });
    } finally {
      setLoading(false);
    }
  };

  // Datos mejorados para gráficos

  const plansByStatus = [
    { name: 'Completados', value: stats.completedPlans, color: '#10b981', percentage: 33 },
    { name: 'En Progreso', value: stats.inProgressPlans, color: '#f59e0b', percentage: 67 },
    { name: 'Nuevos', value: 0, color: '#3b82f6', percentage: 0 }
  ];

  const growthData = [
    { month: 'Ene', users: 10, plans: 2, revenue: 2100 },
    { month: 'Feb', users: 25, plans: 5, revenue: 4500 },
    { month: 'Mar', users: 45, plans: 8, revenue: 8200 },
    { month: 'Abr', users: 70, plans: 12, revenue: 12400 },
    { month: 'May', users: 95, plans: 16, revenue: 18600 },
    { month: 'Jun', users: 127, plans: 21, revenue: 24500 }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Nuevo Plan de Negocio',
      description: 'Comienza tu próximo proyecto exitoso',
      icon: Plus,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      action: () => console.log('Nuevo plan')
    },
    {
      id: '2',
      title: 'Análisis de Mercado',
      description: 'Obtén insights valiosos con IA',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      action: () => console.log('Análisis')
    },
    {
      id: '3',
      title: 'Tutoría Personalizada',
      description: 'Conecta con expertos en tu sector',
      icon: User,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      action: () => console.log('Tutoría')
    },
    {
      id: '4',
      title: 'Recursos Premium',
      description: 'Accede a plantillas exclusivas',
      icon: Star,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      action: () => console.log('Recursos')
    }
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Briefcase, label: 'Mis Planes', path: '/dashboard/plans', active: false },
    { icon: BarChart3, label: 'Análisis', path: '/dashboard/analytics', active: false },
    { icon: User, label: 'Perfil', path: '/dashboard/profile', active: false },
    { icon: Settings, label: 'Configuración', path: '/dashboard/settings', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-white mb-2">Cargando Dashboard</h2>
          <p className="text-gray-300 text-lg">Preparando tu espacio de trabajo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/30 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0`}>
        <div className="flex items-center justify-between p-8 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HotCash</h1>
              <p className="text-purple-300 text-sm">Plataforma Empresarial</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="xl:hidden text-white/70 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-6">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-4 px-6 py-4 rounded-xl mb-3 transition-all duration-200 ${
                  item.active 
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/20' 
                    : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile Card */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Usuario Emprendedor</h3>
                <p className="text-purple-300 text-sm">Plan Premium</p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="xl:ml-80">
        {/* Top Bar */}
        <div className="bg-black/20 backdrop-blur-lg border-b border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="xl:hidden text-white/80 hover:text-white bg-white/10 p-3 rounded-xl"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-purple-300 text-lg">Bienvenido de vuelta, emprendedor</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d" className="bg-slate-800">Últimos 7 días</option>
                <option value="30d" className="bg-slate-800">Últimos 30 días</option>
                <option value="90d" className="bg-slate-800">Últimos 90 días</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-12">
          {/* Stats Cards - MEGA VISUAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white mb-2">{stats.totalPlans}</div>
                <div className="text-blue-300 text-xl font-medium">Planes Totales</div>
                <div className="text-green-400 text-lg font-semibold">+12.5% este mes</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-8 h-8 text-white text-2xl font-bold">✓</div>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white mb-2">{stats.completedPlans}</div>
                <div className="text-green-300 text-xl font-medium">Completados</div>
                <div className="text-green-400 text-lg font-semibold">33% de éxito</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold text-white mb-2">{stats.inProgressPlans}</div>
                <div className="text-yellow-300 text-xl font-medium">En Progreso</div>
                <div className="text-yellow-400 text-lg font-semibold">Activos ahora</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white mb-2">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-purple-300 text-xl font-medium">Ingresos Estimados</div>
                <div className="text-green-400 text-lg font-semibold">+$5,200 este mes</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <Zap className="w-8 h-8 mr-4 text-yellow-400" />
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} p-6 rounded-2xl text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{action.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Growth Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <TrendingUp className="w-8 h-8 mr-4 text-green-400" />
                  Crecimiento de la Plataforma
                </h2>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">Usuarios</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-white text-sm">Planes</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPlans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff70" fontSize={14} />
                  <YAxis stroke="#ffffff70" fontSize={14} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #ffffff20', 
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '14px'
                    }} 
                  />
                  <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" name="Usuarios" />
                  <Area type="monotone" dataKey="plans" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPlans)" name="Planes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Target className="w-8 h-8 mr-4 text-purple-400" />
                Estado de tus Planes
              </h2>
              <div className="flex items-center justify-center mb-8">
                <ResponsiveContainer width={300} height={300}>
                  <PieChart>
                    <Pie
                      data={plansByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }: any) => `${name} ${value}%`}
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
                        borderRadius: '16px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {plansByStatus.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full" style={{backgroundColor: status.color}}></div>
                      <span className="text-white text-lg font-medium">{status.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-xl font-bold">{status.value}</div>
                      <div className="text-gray-400 text-sm">{status.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Activity className="w-8 h-8 mr-4 text-blue-400" />
                Actividades Recientes
              </h2>
              <button className="text-purple-400 hover:text-purple-300 flex items-center space-x-2 text-lg font-medium">
                <span>Ver todas</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              {activities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center space-x-6 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-200 group">
                    <div className={`w-16 h-16 ${activity.color} bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg font-medium leading-relaxed mb-2">{activity.description}</p>
                      <p className="text-gray-400 text-base">{new Date(activity.timestamp).toLocaleString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Plans */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <FileText className="w-8 h-8 mr-4 text-blue-400" />
                Mis Planes de Negocio
              </h2>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <span>Nuevo Plan</span>
              </button>
            </div>
            
            {plans.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Aún no tienes planes</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Comienza tu viaje emprendedor creando tu primer plan de negocio con ayuda de nuestra IA
                </p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform">
                  Crear Mi Primer Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-400 transition-colors p-2">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-green-400 transition-colors p-2">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-red-400 transition-colors p-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{plan.title}</h3>
                      <p className="text-gray-300 text-base leading-relaxed">{plan.summary}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="text-sm text-gray-400">
                          <div>Creado: {new Date(plan.createdAt).toLocaleDateString('es-ES')}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm font-medium">Activo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardUltra;