import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGenres } from '../../services/api';
import { Genre } from '../../types/movie';
import { motion } from 'framer-motion';

const GenreList: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (err) {
        setError('Failed to load genres. Please try again later.');
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(12)].map((_, index) => (
          <div 
            key={index} 
            className="h-16 rounded-lg bg-gray-200 dark:bg-primary-700"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
        <p>{error}</p>
      </div>
    );
  }

  // Some predefined background colors for variety
  const bgColors = [
    'bg-primary-700',
    'bg-primary-800',
    'bg-primary-900',
    'bg-highlight-700',
    'bg-highlight-800',
    'bg-accent-700',
    'bg-accent-800',
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {genres.map((genre, index) => (
        <motion.div
          key={genre.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link 
            to={`/genres/${genre.id}`}
            className={`block ${bgColors[index % bgColors.length]} text-white rounded-lg p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg`}
          >
            <h3 className="font-heading font-semibold text-lg">{genre.name}</h3>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default GenreList;