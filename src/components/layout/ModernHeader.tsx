import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Briefcase, BarChart3, Home } from 'lucide-react';

interface ModernHeaderProps {
  handleLogout: () => void;
}

function ModernHeader({ handleLogout }: ModernHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Usuario';

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">HotCash</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="text-white/80 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleNavigation('/dashboard/profile')}
              className="text-white/80 hover:text-white transition-colors flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </button>
            <button
              onClick={() => handleNavigation('/dashboard/chatbot')}
              className="text-white/80 hover:text-white transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Asistente</span>
            </button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{username}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/30 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleNavigation('/dashboard/profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Mi Perfil</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNavigation('/dashboard/settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configuración</span>
                    </button>
                    <hr className="border-white/10 my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 mt-4 pt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-2 text-left"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/profile')}
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-2 text-left"
              >
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/chatbot')}
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-2 text-left"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Asistente</span>
              </button>
              <hr className="border-white/10" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default ModernHeader;