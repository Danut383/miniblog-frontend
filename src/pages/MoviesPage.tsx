import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import MovieGrid from '../components/movies/MovieGrid';
import { useMovies } from '../hooks/useMovies';

const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'popular';
  
  // State for filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Set up movies hook with the right category
  const { 
    movies, 
    loading, 
    error, 
    page, 
    totalPages, 
    goToPage 
  } = useMovies({ 
    category: categoryParam as 'popular' | 'top_rated' | 'upcoming',
  });

  // Update page title based on category
  useEffect(() => {
    const titles = {
      'popular': 'Popular Movies',
      'top_rated': 'Top Rated Movies',
      'upcoming': 'Upcoming Movies',
    };
    document.title = `${titles[categoryParam as keyof typeof titles]} | CinemaBlog`;
  }, [categoryParam]);

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setSearchParams({ category: newCategory });
  };

  return (
    <main className="pt-24 pb-12">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 bg-white dark:bg-primary-800 rounded-lg shadow-md p-6">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-semibold">Filters</h2>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-primary-600 dark:text-primary-400"
              >
                <Filter size={20} />
              </button>
            </div>
            
            {/* Filter Options (hidden on mobile unless toggled) */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
              <h2 className="hidden md:block text-xl font-heading font-semibold mb-4">Movie Categories</h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleCategoryChange('popular')}
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                    categoryParam === 'popular'
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-200 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-primary-700/50'
                  }`}
                >
                  Popular Movies
                </button>
                
                <button
                  onClick={() => handleCategoryChange('top_rated')}
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                    categoryParam === 'top_rated'
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-200 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-primary-700/50'
                  }`}
                >
                  Top Rated
                </button>
                
                <button
                  onClick={() => handleCategoryChange('upcoming')}
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                    categoryParam === 'upcoming'
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-200 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-primary-700/50'
                  }`}
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-heading font-bold mb-2">
                {categoryParam === 'popular' && 'Popular Movies'}
                {categoryParam === 'top_rated' && 'Top Rated Movies'}
                {categoryParam === 'upcoming' && 'Upcoming Movies'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {categoryParam === 'popular' && 'Discover the most popular movies right now.'}
                {categoryParam === 'top_rated' && 'The highest rated movies of all time.'}
                {categoryParam === 'upcoming' && 'Movies coming to theaters soon.'}
              </p>
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
        </div>
      </div>
    </main>
  );
};

export default MoviesPage;