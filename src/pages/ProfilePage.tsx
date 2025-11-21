import React, { useState, useEffect } from 'react';
import { getJson, postJson } from '../api/client';
import './ProfilePage.css';
import { UserProfile, AVAILABLE_ROLES, COMMON_COUNTRIES, getRoleLabel } from '../types/profile.types';

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    userId: '',
    fullName: '',
    role: 'ENTREPRENEUR',
    country: ''
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
      country: ''
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Mi Perfil de Emprendedor</h1>
          {!editing && (
            <button onClick={handleEdit} className="btn btn-primary">
              Editar Perfil
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <strong>Éxito:</strong> {success}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Nombre Completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Rol *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                {AVAILABLE_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="country">País</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Selecciona un país (opcional)</option>
                {COMMON_COUNTRIES.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Guardar Cambios
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <label>Nombre Completo:</label>
              <span className="info-value">{profile?.fullName || 'No especificado'}</span>
            </div>

            <div className="info-group">
              <label>Rol:</label>
              <span className="info-value">
                {getRoleLabel(profile?.role) || 'No especificado'}
              </span>
            </div>

            <div className="info-group">
              <label>País:</label>
              <span className="info-value">{profile?.country || 'No especificado'}</span>
            </div>

            {profile?.createdAt && (
              <div className="info-group">
                <label>Miembro desde:</label>
                <span className="info-value">
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