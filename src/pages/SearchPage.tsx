import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import MovieGrid from '../components/movies/MovieGrid';
import { useMovies } from '../hooks/useMovies';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { 
    movies, 
    loading, 
    error, 
    page, 
    totalPages, 
    goToPage 
  } = useMovies({ 
    category: 'search',
    query,
  });

  useEffect(() => {
    document.title = `Search: ${query} | CinemaBlog`;
  }, [query]);

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
                defaultValue={query}
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
          
          {query && (
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                Search results for: <span className="font-semibold">"{query}"</span>
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
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </main>
  );
};

export default SearchPage;