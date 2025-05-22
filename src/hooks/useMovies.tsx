import { useState, useEffect } from 'react';
import { Movie, MoviesResponse } from '../types/movie';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, searchMovies, getMoviesByGenre } from '../services/api';

type MovieCategory = 'popular' | 'top_rated' | 'upcoming' | 'search' | 'genre';

interface UseMoviesProps {
  category?: MovieCategory;
  query?: string;
  genreId?: number;
  initialPage?: number;
}

export const useMovies = ({
  category = 'popular',
  query = '',
  genreId = 0,
  initialPage = 1,
}: UseMoviesProps = {}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response: MoviesResponse;
      
      switch (category) {
        case 'popular':
          response = await getPopularMovies(page);
          break;
        case 'top_rated':
          response = await getTopRatedMovies(page);
          break;
        case 'upcoming':
          response = await getUpcomingMovies(page);
          break;
        case 'search':
          if (!query) {
            setMovies([]);
            setLoading(false);
            return;
          }
          response = await searchMovies(query, page);
          break;
        case 'genre':
          if (!genreId) {
            setMovies([]);
            setLoading(false);
            return;
          }
          response = await getMoviesByGenre(genreId, page);
          break;
        default:
          response = await getPopularMovies(page);
      }
      
      setMovies(response.results);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error('Error in useMovies hook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [category, query, genreId, page]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return {
    movies,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    refreshMovies: fetchMovies,
  };
};