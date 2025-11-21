import React, { useState, useEffect } from 'react';
import { getJson, postJson } from '../api/client';
import { UserProfile, AVAILABLE_ROLES, COMMON_COUNTRIES, getRoleLabel } from '../types/profile.types';

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    userId: '',
    fullName: '',
    role: 'ENTREPRENEUR',
    country: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await getJson('/api/profile/me');
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError('Error al cargar el perfil');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('El nombre completo es requerido');
      return;
    }

    if (!formData.role) {
      setError('El rol es requerido');
      return;
    }

    try {
      const response = await postJson('/api/profile/me', formData);
      setProfile(response);
      setSuccess('Perfil actualizado exitosamente');
      setEditing(false);
    } catch (err) {
      setError('Error al actualizar el perfil');
      console.error('Error updating profile:', err);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profile || {
      userId: '',
      fullName: '',
      role: 'ENTREPRENEUR',
      country: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-500 py-8">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Mi Perfil de Emprendedor</h1>
          {!editing && (
            <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Editar Perfil
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <strong className="text-red-800">Error:</strong> <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <strong className="text-green-800">Éxito:</strong> <span className="text-green-700">{success}</span>
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              >
                {AVAILABLE_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">País</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Selecciona un país (opcional)</option>
                {COMMON_COUNTRIES.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1">
                Guardar Cambios
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="font-medium text-gray-600">Nombre Completo:</label>
              <span className="text-gray-800 border-b border-gray-100 pb-2 md:col-span-2">{profile?.fullName || 'No especificado'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="font-medium text-gray-600">Rol:</label>
              <span className="text-gray-800 border-b border-gray-100 pb-2 md:col-span-2">
                {profile?.role ? getRoleLabel(profile.role) : 'No especificado'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="font-medium text-gray-600">País:</label>
              <span className="text-gray-800 border-b border-gray-100 pb-2 md:col-span-2">{profile?.country || 'No especificado'}</span>
            </div>

            {profile?.createdAt && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="font-medium text-gray-600">Miembro desde:</label>
                <span className="text-gray-800 border-b border-gray-100 pb-2 md:col-span-2">
                  {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;