import { useState, useCallback, useEffect } from 'react';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, searchMovies, getMoviesByGenre } from '../services/api';
import { Movie, MoviesResponse } from '../types/movie';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = useCallback(async (pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPopularMovies(pageNumber);
      setMovies(data.results);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch movies');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoviesByGenre = useCallback(async (genreId: number, pageNumber: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMoviesByGenre(genreId, pageNumber);
      setMovies(data.results);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch movies by genre');
      console.error('Error fetching movies by genre:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setPage(pageNumber);
    fetchMovies(pageNumber);
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    page,
    totalPages,
    fetchMovies,
    fetchMoviesByGenre,
    goToPage
  };
};