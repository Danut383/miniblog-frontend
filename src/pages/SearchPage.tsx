import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import MovieGrid from '../components/movies/MovieGrid';
import { searchMovies } from '../api/movies'; // Asegúrate de importar correctamente la función searchMovies

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [location]);

  useEffect(() => {
    document.title = `Search: ${searchQuery} | CinemaBlog`;
  }, [searchQuery]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;
    
    if (searchInput.value.trim()) {
      setSearchParams({ q: searchInput.value.trim() });
    }
  };

  return (
    <main className="pt-24 pb-12">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-6">Search Movies</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-8">
            <div className="relative max-w-2xl">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search for movies..."
                className="w-full py-3 pl-12 pr-4 rounded-lg text-black bg-white placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 rounded-md"
              >
                Search
              </button>
            </div>
          </form>
          
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                Search results for: <span className="font-semibold">"{searchQuery}"</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Found {loading ? '...' : movies.length === 0 ? 'no' : movies.length} movies
              </p>
            </div>
          )}
        </div>
        
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          page={1} // Cambia esto si implementas paginación
          totalPages={1} // Cambia esto si implementas paginación
          onPageChange={() => {}} // Cambia esto si implementas paginación
        />
      </div>
    </main>
  );
};

export default SearchPage;