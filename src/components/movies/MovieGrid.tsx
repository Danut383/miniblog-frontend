import React from 'react';
import { Movie } from '../../types/movie';
import MovieCard from './MovieCard';
import Pagination from '../ui/Pagination';
import { motion } from 'framer-motion';

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-pulse space-y-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-primary-700 rounded-lg overflow-hidden">
                <div className="aspect-[2/3] bg-gray-300 dark:bg-primary-600"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-300 dark:bg-primary-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-primary-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg max-w-md text-center">
          <p className="font-medium">{error}</p>
          <p className="mt-2 text-sm">Please try again later or check your connection.</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-6 rounded-lg max-w-md text-center">
          <p className="font-medium text-lg">No movies found</p>
          <p className="mt-2">Try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="py-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
      
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </motion.div>
  );
};

export default MovieGrid;