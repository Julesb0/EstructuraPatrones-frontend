const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8080';

export interface AuthResponse {
  token: string;
  username: string;
}

export interface BusinessPlan {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
}

export async function postJson(endpoint: string, data: any): Promise<any> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getJson(endpoint: string): Promise<any> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}