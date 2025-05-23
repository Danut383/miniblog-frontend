import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MovieGrid from '../components/movies/MovieGrid';
import { useMovies } from '../hooks/useMovies';
import { getGenres } from '../services/api';
import { Genre } from '../types/movie';

const GenreMoviesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const genreId = parseInt(id || '0');
  
  const {
    movies,
    loading,
    error,
    page,
    totalPages,
    goToPage,
    fetchMoviesByGenre
  } = useMovies();

  useEffect(() => {
    if (genreId) {
      fetchMoviesByGenre(genreId, 1);
    }
  }, [genreId, fetchMoviesByGenre]);

  const [genre, setGenre] = useState<Genre | null>(null);
  const [loadingGenre, setLoadingGenre] = useState(true);

  useEffect(() => {
    const fetchGenreName = async () => {
      if (!id) return;
      
      try {
        const genres = await getGenres();
        const currentGenre = genres.find((g: Genre) => g.id === parseInt(id));
        
        if (currentGenre) {
          setGenre(currentGenre);
          document.title = `${currentGenre.name} Movies | CinemaBlog`;
        }
      } catch (err) {
        console.error('Error fetching genre:', err);
      } finally {
        setLoadingGenre(false);
      }
    };
    
    fetchGenreName();
  }, [id]);

  if (loadingGenre) {
    return (
      <div className="pt-24 pb-12">
        <div className="container-custom mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-primary-700 w-1/3 rounded mb-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-primary-700 w-1/2 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-12">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <Link 
            to="/genres" 
            className="inline-flex items-center text-primary-600 dark:text-primary-400 mb-4 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to All Genres
          </Link>
          
          <h1 className="text-3xl font-heading font-bold mb-2">
            {genre ? `${genre.name} Movies` : 'Genre Movies'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Exploring the best {genre?.name.toLowerCase()} films from our collection.
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
    </main>
  );
};

export default GenreMoviesPage;