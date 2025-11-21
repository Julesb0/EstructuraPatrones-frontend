export interface UserProfile {
  userId: string;
  fullName: string;
  role: UserRole;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ENTREPRENEUR' | 'MENTOR' | 'INVESTOR' | 'ADMIN';

export interface ProfileUpdateRequest {
  fullName: string;
  role: UserRole;
  country: string;
}

export interface ProfileResponse {
  userId: string;
  fullName: string;
  role: UserRole;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export const AVAILABLE_ROLES = [
  { value: 'ENTREPRENEUR', label: 'Emprendedor' },
  { value: 'MENTOR', label: 'Mentor' },
  { value: 'INVESTOR', label: 'Inversor' },
  { value: 'ADMIN', label: 'Administrador' }
];

export const COMMON_COUNTRIES = [
  'México', 'Estados Unidos', 'Canadá', 'Brasil', 'Argentina', 'Colombia',
  'Chile', 'Perú', 'España', 'Reino Unido', 'Francia', 'Alemania',
  'Italia', 'China', 'Japón', 'Corea del Sur', 'India', 'Australia'
];

export function getRoleLabel(role: UserRole): string {
  const roleObj = AVAILABLE_ROLES.find(r => r.value === role);
  return roleObj?.label || role;
}