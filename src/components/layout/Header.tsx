import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Menu, X, Search } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Navegando a búsqueda con query: "${searchQuery}"`);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Limpiar después de buscar
    }
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white bg-opacity-95 dark:bg-primary-900 dark:bg-opacity-95 shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-800 dark:text-white no-underline">
            <Film size={30} className="text-accent-400" />
            <span className="font-heading text-2xl font-bold tracking-tight">CinemaBlog</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium ${location.pathname === '/' ? 'text-accent-500 dark:text-accent-400' : 'text-gray-700 dark:text-gray-200'} hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200`}>
              Inicio
            </Link>
            <Link to="/movies" className={`font-medium ${location.pathname.includes('/movies') ? 'text-accent-500 dark:text-accent-400' : 'text-gray-700 dark:text-gray-200'} hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200`}>
              Películas
            </Link>
            <Link to="/genres" className={`font-medium ${location.pathname.includes('/genres') ? 'text-accent-500 dark:text-accent-400' : 'text-gray-700 dark:text-gray-200'} hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200`}>
              Géneros
            </Link>
            <Link to="/about" className={`font-medium ${location.pathname === '/about' ? 'text-accent-500 dark:text-accent-400' : 'text-gray-700 dark:text-gray-200'} hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200`}>
              Acerca de
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoginPage && (
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Buscar películas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 pl-10 pr-4 w-48 lg:w-64 rounded-full text-sm bg-gray-100 dark:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all duration-300"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </form>
            )}
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-white hover:underline"
                >
                  Hola, {user.name || user.email}
                </Link>
                <button
                  onClick={signOut}
                  className="text-yellow-400 font-semibold hover:underline transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              !isLoginPage && (
                <Link
                  to="/login"
                  className="text-yellow-400 font-semibold hover:underline transition-colors duration-200"
                >
                  Iniciar sesión
                </Link>
              )
            )}
          </div>

          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button onClick={toggleMenu} className="p-2 text-primary-600 dark:text-primary-300">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-primary-700 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="font-medium hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200">Inicio</Link>
              <Link to="/movies" className="font-medium hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200">Películas</Link>
              <Link to="/genres" className="font-medium hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200">Géneros</Link>
              <Link to="/about" className="font-medium hover:text-accent-500 dark:hover:text-accent-400 transition-colors duration-200">Acerca de</Link>
              {!user && (
                <Link to="/login" className="text-yellow-400 font-semibold hover:underline transition-colors duration-200">Iniciar sesión</Link>
              )}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="text-white hover:underline"
                  >
                    Hola, {user.name || user.email}
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-yellow-400 font-semibold hover:underline transition-colors duration-200"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
