import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Star, TrendingUp, Calendar } from 'lucide-react';
import HeroSlider from '../components/movies/HeroSlider';
import MovieCard from '../components/movies/MovieCard';
import { motion } from 'framer-motion';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies 
} from '../api/movies'; // Adjust the import based on your project structure

const HomePage: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [popular, topRated, upcoming] = await Promise.all([
          getPopularMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1)
        ]);
        
        setPopularMovies(popular.results.slice(0, 10));
        setTopRatedMovies(topRated.results.slice(0, 10));
        setUpcomingMovies(upcoming.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Change page title on component mount
  useEffect(() => {
    document.title = 'CinemaBlog - Your Movie Universe';
  }, []);

  // Take the first 5 popular movies for the hero slider
  const heroMovies = popularMovies.slice(0, 5);

  // Reusable section component
  const MovieSection = ({ 
    title, 
    icon, 
    movies, 
    loading, 
    linkTo 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    movies: any[]; 
    loading: boolean;
    linkTo: string;
  }) => {
    if (loading) {
      return (
        <section className="py-10">
          <div className="container-custom mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                {icon}
                <span>{title}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-pulse">
              {[...Array(5)].map((_, index) => (
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
        </section>
      );
    }

    return (
      <section className="py-10">
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </h2>
            <Link 
              to={linkTo}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.slice(0, 5).map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <main>
      {/* Hero Section with Slider */}
      {!loading && heroMovies.length > 0 && (
        <HeroSlider movies={heroMovies} />
      )}
      
      {/* Popular Movies Section */}
      <MovieSection
        title="Popular Movies"
        icon={<Film className="text-primary-600 dark:text-primary-400" />}
        movies={popularMovies}
        loading={loading}
        linkTo="/movies?category=popular"
      />
      
      {/* Top Rated Movies Section */}
      <MovieSection
        title="Top Rated"
        icon={<Star className="text-accent-400" />}
        movies={topRatedMovies}
        loading={loading}
        linkTo="/movies?category=top_rated"
      />
      
      {/* Upcoming Movies Section */}
      <MovieSection
        title="Coming Soon"
        icon={<Calendar className="text-highlight-500" />}
        movies={upcomingMovies}
        loading={loading}
        linkTo="/movies?category=upcoming"
      />
      
      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-primary-900 dark:bg-black"
      >
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Discover Your Next Favorite Movie
          </h2>
          <p className="text-primary-200 max-w-2xl mx-auto mb-8">
            Browse through thousands of movies, search by genre, or check out what's trending. Your perfect movie night is just a click away.
          </p>
          <Link
            to="/movies"
            className="btn btn-accent inline-flex items-center"
          >
            <TrendingUp size={20} className="mr-2" />
            Explore All Movies
          </Link>
        </div>
      </motion.section>
    </main>
  );
};

export default HomePage;