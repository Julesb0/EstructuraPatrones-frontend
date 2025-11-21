import { supabase } from '../lib/supabaseClient';

export type ChatMessageCategory = 'LEGAL' | 'FINANCE' | 'MARKETING' | 'OTHER';

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'USER' | 'BOT';
  content: string;
  category: ChatMessageCategory;
  createdAt: string;
}

export interface ChatbotResponse {
  reply: string;
  category: string;
  success: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Servicio para interactuar con el chatbot del backend
 */
export const chatbotService = {
  /**
   * Envía un mensaje al chatbot y obtiene una respuesta
   */
  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      // Obtener el token de autenticación actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${API_URL}/api/chatbot/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al enviar el mensaje');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en sendMessage:', error);
      throw error;
    }
  },

  /**
   * Obtiene el historial de conversaciones del usuario
   */
  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      // Obtener el token de autenticación actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${API_URL}/api/chatbot/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al obtener el historial');
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('Error en getChatHistory:', error);
      throw error;
    }
  },

  /**
   * Obtiene el historial de conversaciones filtrado por categoría
   */
  async getChatHistoryByCategory(category: string): Promise<ChatMessage[]> {
    try {
      // Obtener el token de autenticación actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${API_URL}/api/chatbot/history/${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || 'Error al obtener el historial');
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('Error en getChatHistoryByCategory:', error);
      throw error;
    }
  }
};