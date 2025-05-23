import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';
import { searchMovies } from '../services/api';
import { Movie } from '../types/movie';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [location]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Iniciando búsqueda para: "${searchTerm}"`);
      const response = await searchMovies(searchTerm);
      setMovies(response.results || []);
      
      // Actualizar URL sin recargar página
      const newUrl = `/search?q=${encodeURIComponent(searchTerm)}`;
      window.history.pushState({}, '', newUrl);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('Error al buscar películas. Inténtalo de nuevo.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Buscando películas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && movies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Resultados para "{new URLSearchParams(location.search).get('q')}" ({movies.length} películas)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && movies.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No se encontraron películas para "{searchQuery}"
            </p>
            <p className="text-gray-500 mt-2">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && movies.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Busca tus películas favoritas
            </p>
            <p className="text-gray-500 mt-2">
              Usa el buscador para encontrar información sobre cualquier película
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;