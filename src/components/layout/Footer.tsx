import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 dark:bg-primary-800 pt-12 pb-8 mt-12">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-primary-800 dark:text-white no-underline">
              <Film size={30} className="text-accent-400" />
              <span className="font-heading text-2xl font-bold tracking-tight">CinemaBlog</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
              Tu destino definitivo para todo lo relacionado con el cine. Descubre las últimas películas, reseñas y mantente al día con el mundo del séptimo arte.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors duration-200">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-gray-900 dark:text-white">Explora</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Películas
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Géneros
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/movies?category=popular" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Películas populares
                </Link>
              </li>
              <li>
                <Link to="/movies?category=top_rated" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Mejor calificadas
                </Link>
              </li>
              <li>
                <Link to="/movies?category=upcoming" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Próximos estrenos
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200">
                  Buscar por género
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} CinemaBlog. Todos los derechos reservados.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 sm:mt-0 flex items-center">
            Hecho con <Heart size={16} className="mx-1 text-highlight-500" /> para amantes del cine
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;