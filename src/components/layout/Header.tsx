import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Navegando a búsqueda con query: "${searchQuery}"`);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Limpiar después de buscar
      setIsMenuOpen(false); // Cerrar menú móvil si está abierto
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-400">
            CinéBlog
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-red-400 transition-colors">
              Inicio
            </Link>
            <Link to="/movies" className="hover:text-red-400 transition-colors">
              Películas
            </Link>
            <Link to="/genres" className="hover:text-red-400 transition-colors">
              Géneros
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-red-400 transition-colors">
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 relative">
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-4 mt-4">
              <Link 
                to="/" 
                className="hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/movies" 
                className="hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Películas
              </Link>
              <Link 
                to="/genres" 
                className="hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Géneros
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="hover:text-red-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
