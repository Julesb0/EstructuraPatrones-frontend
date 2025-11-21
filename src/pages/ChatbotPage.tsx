import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Filter, History, Sparkles } from 'lucide-react';
import { chatbotService, ChatMessage, ChatbotResponse, ChatMessageCategory } from '../services/chatbot';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const ChatbotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    { value: 'ALL', label: 'Todas', color: 'bg-gray-100 text-gray-800' },
    { value: 'LEGAL', label: 'Legal', color: 'bg-blue-100 text-blue-800' },
    { value: 'FINANCE', label: 'Finanzas', color: 'bg-green-100 text-green-800' },
    { value: 'MARKETING', label: 'Marketing', color: 'bg-purple-100 text-purple-800' },
    { value: 'OTHER', label: 'Otros', color: 'bg-orange-100 text-orange-800' }
  ];

  // Cargar historial al montar el componente
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Filtrar mensajes cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      loadChatHistory();
    } else {
      loadFilteredHistory(selectedCategory);
    }
  }, [selectedCategory]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatbotService.getChatHistory();
      setMessages(history.reverse()); // Ordenar del más antiguo al más reciente
    } catch (error) {
      console.error('Error al cargar el historial:', error);
      toast.error('Error al cargar el historial de conversaciones');
    }
  };

  const loadFilteredHistory = async (category: string) => {
    try {
      const history = await chatbotService.getChatHistoryByCategory(category);
      setMessages(history.reverse()); // Ordenar del más antiguo al más reciente
    } catch (error) {
      console.error('Error al cargar el historial filtrado:', error);
      toast.error('Error al cargar el historial filtrado');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    // Agregar mensaje del usuario inmediatamente
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || '',
      role: 'USER',
      content: inputMessage.trim(),
      category: 'OTHER',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Enviar mensaje al backend
      const response: ChatbotResponse = await chatbotService.sendMessage(inputMessage.trim());
      
      // Agregar respuesta del bot
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: user?.id || '',
        role: 'BOT',
        content: response.reply,
        category: response.category as ChatMessageCategory,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Si estamos filtrando por categoría, recargar el historial
      if (selectedCategory !== 'ALL' && selectedCategory !== response.category) {
        setSelectedCategory('ALL');
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar el mensaje. Por favor, intenta de nuevo.');
      
      // Opcionalmente, podríamos remover el mensaje del usuario si falla
      // setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryConfig = categories.find(cat => cat.value === category);
    return categoryConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Asistente Emprendedor</h1>
          </div>
          <p className="text-gray-600">
            Tu asistente virtual para temas legales, financieros y de marketing
          </p>
        </div>

        {/* Filtros de categoría */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Filtrar por categoría:</span>
            </div>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <History className="w-4 h-4 mr-1" />
              Ver todo
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.value
                    ? 'ring-2 ring-indigo-500 ' + category.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  ¡Bienvenido a tu asistente emprendedor!
                </h3>
                <p className="text-gray-400">
                  Puedo ayudarte con temas legales, financieros y de marketing.
                  <br />¿En qué te gustaría recibir orientación?
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'USER' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'USER'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'USER' ? (
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                      ) : (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            message.role === 'BOT' ? getCategoryColor(message.category) : ''
                          }`}>
                            {message.role === 'BOT' && message.category !== 'OTHER' && message.category}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta sobre legal, finanzas o marketing..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            💡 Sugerencias: Pregunta sobre contratos, presupuestos, redes sociales, SEO, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;