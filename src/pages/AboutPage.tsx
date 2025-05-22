import React, { useEffect } from 'react';
import { Film, Code, Server, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Acerca de CinemaBlog | Tu Universo de Películas';
  }, []);

  return (
    <main className="pt-24 pb-12">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-heading font-bold mb-6">Acerca de CinemaBlog</h1>
          <div className="bg-white dark:bg-primary-800 rounded-xl shadow-md p-6 md:p-8 mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              CinemaBlog es tu destino principal para todo lo relacionado con el cine. Ofrecemos una base de datos completa de películas de todo el mundo, con información detallada, calificaciones y más para ayudarte a descubrir tu próxima película favorita.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Nuestra misión es conectar a los amantes del cine con las películas que les encantarán. Ya sea que busques los últimos estrenos, joyas ocultas o clásicos de la historia del cine, CinemaBlog te ayuda a explorar el vasto mundo del cine con facilidad.
            </p>
          </div>
          {/* Características */}
          <h2 className="text-2xl font-heading font-semibold mb-6">Nuestras características</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div 
              className="bg-white dark:bg-primary-800 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Film size={32} className="text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Base de datos extensa de películas</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Accede a información de miles de películas, desde los últimos estrenos hasta clásicos atemporales. Nuestra base de datos incluye detalles de reparto, equipo, calificaciones, reseñas y más.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-primary-800 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Globe size={32} className="text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Descubre nuevas películas</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Explora películas por género, popularidad, calificación o fecha de estreno. Nuestras colecciones y recomendaciones te ayudan a encontrar películas que se adapten a tus gustos.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-primary-800 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Server size={32} className="text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Integración robusta de API</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Nuestra plataforma se integra con la API de The Movie Database (TMDb) para ofrecerte información actualizada de películas de todo el mundo, asegurando que siempre tengas acceso a los últimos datos.
              </p>
            </motion.div>
            <motion.div 
              className="bg-white dark:bg-primary-800 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Code size={32} className="text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Tecnología moderna</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Desarrollado con React, TypeScript y Tailwind CSS, CinemaBlog ofrece una experiencia responsiva y amigable en todos los dispositivos. Nuestra arquitectura moderna garantiza tiempos de carga rápidos y navegación fluida.
              </p>
            </motion.div>
          </div>
          {/* Información técnica */}
          <h2 className="text-2xl font-heading font-semibold mb-6">Información técnica</h2>
          <div className="bg-white dark:bg-primary-800 rounded-xl shadow-md p-6 md:p-8 mb-12">
            <h3 className="text-xl font-heading font-semibold mb-4">Nuestro stack</h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-300 p-1 rounded mr-3 mt-1">•</span>
                <span><strong>Frontend:</strong> React con TypeScript, arquitectura basada en componentes y tipado seguro</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-300 p-1 rounded mr-3 mt-1">•</span>
                <span><strong>Estilos:</strong> Tailwind CSS para estilos responsivos y utilitarios</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-300 p-1 rounded mr-3 mt-1">•</span>
                <span><strong>Herramienta de build:</strong> Vite para desarrollo rápido y builds optimizados</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-300 p-1 rounded mr-3 mt-1">•</span>
                <span><strong>Integración de API:</strong> Axios para peticiones HTTP a la API de TMDb</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-300 p-1 rounded mr-3 mt-1">•</span>
                <span><strong>Animaciones:</strong> Framer Motion para animaciones suaves en la interfaz</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-primary-300 p-1 rounded mr-3 mt-1">•</span>
                <span><strong>Ruteo:</strong> React Router para navegación en el cliente</span>
              </li>
            </ul>
          </div>
          {/* Atribución */}
          <div className="bg-primary-50 dark:bg-primary-900/50 rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-heading font-semibold mb-4">Atribución de API</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Este producto utiliza la API de TMDb pero no está avalado ni certificado por TMDb. Agradecemos a TMDb por proveer los datos que alimentan CinemaBlog.
            </p>
            <div className="flex items-center space-x-4">
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
                alt="Logo TMDb" 
                className="h-8 sm:h-10"
              />
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Visitar TMDb
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AboutPage;