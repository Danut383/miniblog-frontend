import { useState, useEffect, useCallback } from 'react';
import { Movie, MoviesResponse } from '../types/movie';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, searchMovies, getMoviesByGenre } from '../services/api';

type MovieCategory = 'popular' | 'top_rated' | 'upcoming' | 'search' | 'genre';

interface UseMoviesProps {
  category?: MovieCategory;
  query?: string;
  genreId?: number;
  initialPage?: number;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: MoviesResponse = await getPopularMovies();
      setMovies(response.results);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error('Error in useMovies hook:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesByGenre = useCallback(async (genreId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMoviesByGenre(genreId); // Solo pasar genreId
      setMovies(data.results);
    } catch (err) {
      setError('Failed to fetch movies by genre');
      console.error('Error fetching movies by genre:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    fetchMovies,
    fetchMoviesByGenre,
  };
};