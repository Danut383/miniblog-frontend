import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '../../types/movie';
import { getImageUrl } from '../../services/api';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  // Format the release date
  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate a delay based on the index for staggered animations
  const delay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="card group"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative overflow-hidden aspect-[2/3]">
          <img 
            src={getImageUrl(movie.poster_path)} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <span className="text-white font-medium line-clamp-3 transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0">
              {movie.overview}
            </span>
          </div>
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center text-xs font-medium text-white">
            <Star size={14} className="text-accent-400 mr-1" fill="currentColor" />
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {movie.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {formatReleaseDate(movie.release_date)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;