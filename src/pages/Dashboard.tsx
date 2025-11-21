import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJson, postJson, BusinessPlan } from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './Dashboard.css';

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
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <Link to="/dashboard/profile" className="btn btn-secondary">
            Ver Perfil
          </Link>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Nuevo Plan de Negocio
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon plans-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalPlans}</h3>
            <p>Planes Totales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedPlans}</h3>
            <p>Planes Completados</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon progress-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.inProgressPlans}</h3>
            <p>En Progreso</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon activity-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.recentActivities}</h3>
            <p>Actividades Recientes</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Planes por Mes</h3>
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

        <div className="chart-card">
          <h3>Distribución por Estado</h3>
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
      <div className="chart-card full-width">
        <h3>Crecimiento de la Plataforma</h3>
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
      <div className="recent-activities">
        <h3>Actividades Recientes</h3>
        <div className="activities-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'plan_created' && '📋'}
                {activity.type === 'plan_updated' && '✏️'}
                {activity.type === 'profile_updated' && '👤'}
              </div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <small>{new Date(activity.timestamp).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de planes */}
      <div className="plans-section">
        <h3>Mis Planes de Negocio</h3>
        {plans.length === 0 ? (
          <div className="empty-state">
            <p>No tienes planes de negocio aún.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Crear tu primer plan
            </button>
          </div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <h4>{plan.title}</h4>
                <p>{plan.summary}</p>
                <div className="plan-meta">
                  <small>Creado: {new Date(plan.createdAt).toLocaleDateString()}</small>
                  <small>Actualizado: {new Date(plan.updatedAt).toLocaleDateString()}</small>
                </div>
                <div className="plan-actions">
                  <button className="btn btn-sm btn-secondary">Ver Detalles</button>
                  <button className="btn btn-sm btn-outline">Editar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear nuevo plan */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Plan de Negocio</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Título del Plan</label>
                <input
                  type="text"
                  id="title"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="summary">Resumen</label>
                <textarea
                  id="summary"
                  value={newPlan.summary}
                  onChange={(e) => setNewPlan({ ...newPlan, summary: e.target.value })}
                  required
                  rows={4}
                  className="form-control"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
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