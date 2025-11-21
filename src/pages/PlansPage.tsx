import React, { useState, useEffect } from 'react';
import { getJson, postJson, putJson, deleteJson } from '../api/client';
import { Plus, Edit, Trash2, Eye, X, Check, Clock, FileText } from 'lucide-react';

interface BusinessPlan {
  id: string;
  title: string;
  summary: string;
  status: 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

function PlansPage() {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<BusinessPlan | null>(null);
  const [formData, setFormData] = useState({ title: '', summary: '', status: 'in_progress' as 'in_progress' | 'completed' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getJson('/api/plans');
      setPlans(data);
    } catch (err) {
      setError('Error al cargar los planes');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingPlan) {
        // Update existing plan
        const updatedPlan = await putJson(`/api/plans/${editingPlan.id}`, formData);
        setPlans(plans.map(plan => plan.id === editingPlan.id ? updatedPlan : plan));
        setSuccess('Plan actualizado exitosamente');
      } else {
        // Create new plan
        const newPlan = await postJson('/api/plans', formData);
        setPlans([...plans, newPlan]);
        setSuccess('Plan creado exitosamente');
      }

      setFormData({ title: '', summary: '', status: 'in_progress' });
      setShowForm(false);
      setEditingPlan(null);
    } catch (err) {
      setError('Error al guardar el plan');
      console.error('Error saving plan:', err);
    }
  };

  const handleEdit = (plan: BusinessPlan) => {
    setEditingPlan(plan);
    setFormData({ title: plan.title, summary: plan.summary, status: plan.status as 'in_progress' });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      return;
    }

    try {
      await deleteJson(`/api/plans/${planId}`);
      setPlans(plans.filter(plan => plan.id !== planId));
      setSuccess('Plan eliminado exitosamente');
    } catch (err) {
      setError('Error al eliminar el plan');
      console.error('Error deleting plan:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({ title: '', summary: '', status: 'in_progress' });
    setError('');
    setSuccess('');
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? 
      <Check className="w-4 h-4 text-green-500" /> : 
      <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusLabel = (status: string) => {
    return status === 'completed' ? 'Completado' : 'En Progreso';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-500 py-8">Cargando planes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mis Planes de Negocio</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Plan</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 text-green-200">
            {success}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tienes planes aún</h3>
            <p className="text-gray-300 mb-6">Comienza creando tu primer plan de negocio</p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Crear Primer Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(plan.status)}
                    <span className="text-sm text-gray-300">{getStatusLabel(plan.status)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(plan)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{plan.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{plan.summary}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Creado: {new Date(plan.createdAt).toLocaleDateString('es-ES')}</span>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para crear/editar plan */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCancel}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingPlan ? 'Editar Plan' : 'Nuevo Plan de Negocio'}
              </h3>
              <button 
                onClick={handleCancel}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Título del Plan *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mi nuevo plan de negocio"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
                  Resumen *
                </label>
                <textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe tu idea de negocio..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'in_progress' })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  {editingPlan ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlansPage;