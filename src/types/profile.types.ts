/**
 * TypeScript interfaces for User Profile module
 * Matching backend ProfileResponse and ProfileUpdateRequest
 */

// User role types
export type UserRole = 'ENTREPRENEUR' | 'MENTOR' | 'INVESTOR' | 'ADMIN';

// Profile response from backend
export interface UserProfile {
  userId: string;
  fullName: string;
  role: UserRole;
  country: string;
  createdAt?: string;
  updatedAt?: string;
}

// Profile update request to backend
export interface ProfileUpdateRequest {
  fullName: string;
  role: UserRole;
  country: string;
}

// Available roles for dropdowns
export const AVAILABLE_ROLES = [
  { value: 'ENTREPRENEUR' as UserRole, label: 'Emprendedor' },
  { value: 'MENTOR' as UserRole, label: 'Mentor' },
  { value: 'INVESTOR' as UserRole, label: 'Inversor' },
  { value: 'ADMIN' as UserRole, label: 'Administrador' }
];

// Common countries for dropdowns
export const COMMON_COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua',
  'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana',
  'Uruguay', 'Venezuela', 'España', 'Estados Unidos'
];

// Helper function to get role label
export function getRoleLabel(role: UserRole): string {
  const roleObj = AVAILABLE_ROLES.find(r => r.value === role);
  return roleObj?.label || role;
}

// Helper function to validate role
export function isValidRole(role: string): role is UserRole {
  return ['ENTREPRENEUR', 'MENTOR', 'INVESTOR', 'ADMIN'].includes(role);
}