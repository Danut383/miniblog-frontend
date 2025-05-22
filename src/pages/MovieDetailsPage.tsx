import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, ArrowLeft, Heart } from 'lucide-react';
import { 
  getMovieDetails, 
  getImageUrl, 
  getMovieReviewsWithFallback,
  createReviewWithFallback
} from '../services/api';
import { MovieDetails } from '../types/movie';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import StarRating from '../components/ui/StarRating';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuthStore();
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const movieData = await getMovieDetails(parseInt(id));
        setMovie(movieData);
        document.title = `${movieData.title} | CinemaBlog`;
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    window.scrollTo(0, 0);
    fetchMovie();
  }, [id]);
  
  // Obtener reseñas de la película
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        console.log("Obteniendo reseñas para la película ID:", id);
        
        // Usar nuestra función robusta que implementa fallbacks
        const reviews = await getMovieReviewsWithFallback(id);
        setUserReviews(reviews);
        
      } catch (err) {
        console.error('Error inesperado obteniendo reseñas:', err);
        setUserReviews([]); // Aseguramos un array vacío para evitar errores en la UI
      }
    };
    
    fetchReviews();
  }, [id]);
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !reviewTitle || !reviewContent) return;
    
    setSubmittingReview(true);
    setReviewSuccess(false);
    setReviewError(null);
    
    try {
      const reviewData = {
        movieId: parseInt(id || '0'),
        title: reviewTitle,
        content: reviewContent,
        rating: reviewRating || 0,
        posterPath: movie?.poster_path || '',
        movieTitle: movie?.title || '',
      };
      
      console.log("Creando reseña con datos:", reviewData);
      
      // Usar nuestra función robusta para crear reseñas
      const newReview = await createReviewWithFallback(reviewData, token);
      
      // Limpia el formulario
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(0);
      
      // Añadir la nueva reseña al estado actual
      setUserReviews(prevReviews => [newReview, ...prevReviews]);
      
      // Mostrar mensaje de éxito
      setReviewSuccess(true);
      
      // Si la reseña es local (no se guardó en servidor por error)
      if (newReview.isLocal) {
        setReviewError('La reseña se ha guardado localmente, pero no en el servidor. Inténtalo de nuevo más tarde.');
      }
      
    } catch (err) {
      console.error('Error al crear reseña:', err);
      setReviewError('No se pudo guardar la reseña. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setSubmittingReview(false);
      
      // Auto-ocultar mensaje de éxito después de 5 segundos
      if (reviewSuccess) {
        setTimeout(() => {
          setReviewSuccess(false);
        }, 5000);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container-custom mx-auto">
          <div className="animate-pulse">
            <div className="h-[60vh] bg-gray-300 dark:bg-primary-700 rounded-xl mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="bg-gray-300 dark:bg-primary-700 aspect-[2/3] rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-300 dark:bg-primary-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-primary-700 rounded w-1/2"></div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="h-10 bg-gray-300 dark:bg-primary-700 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-primary-700 rounded w-full mb-6"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-gray-300 dark:bg-primary-700 rounded w-full"></div>
                  <div className="h-5 bg-gray-300 dark:bg-primary-700 rounded w-full"></div>
                  <div className="h-5 bg-gray-300 dark:bg-primary-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !movie) {
    return (
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container-custom mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md mx-auto text-center">
            <p className="font-medium text-lg">{error || 'Movie not found'}</p>
            <Link to="/movies" className="mt-4 inline-block btn btn-primary">
              Return to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  // Format release date
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format budget/revenue to USD
  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <main className="min-h-screen">
      {/* Hero Backdrop */}
      <div 
        className="h-[50vh] md:h-[70vh] relative bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="container-custom mx-auto">
            <Link 
              to="/movies" 
              className="inline-flex items-center text-white bg-black/30 px-4 py-2 rounded-full mb-4 hover:bg-black/50 transition-colors duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
      
      {/* Movie Details */}
      <div className="container-custom mx-auto -mt-32 relative z-10 pb-16">
        <div className="bg-white dark:bg-primary-800 rounded-xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster and Quick Info */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={getImageUrl(movie.poster_path, 'w500')} 
                  alt={movie.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Star size={22} className="text-accent-400 mr-2" fill="currentColor" />
                    <div>
                      <div className="font-semibold">{movie.vote_average.toFixed(1)}/10</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{movie.vote_count.toLocaleString()} votes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={22} className="text-primary-600 dark:text-primary-400 mr-2" />
                    <div className="font-semibold">{formatRuntime(movie.runtime)}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar size={22} className="text-primary-600 dark:text-primary-400 mr-2" />
                    <div className="font-semibold">{formatReleaseDate(movie.release_date)}</div>
                  </div>
                  
                  <button className="w-full btn bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center">
                    <Heart size={18} className="mr-2" />
                    Add to Favorites
                  </button>
                </div>
              </motion.div>
            </div>
            
            {/* Main Content */}
            <motion.div 
              className="w-full md:w-2/3 lg:w-3/4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="text-lg text-gray-600 dark:text-gray-400 italic mb-6">
                  "{movie.tagline}"
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <Link
                    key={genre.id}
                    to={`/genres/${genre.id}`}
                    className="badge badge-primary"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-heading font-semibold mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-3">Details</h2>
                  <dl className="space-y-2">
                    <div className="flex flex-col">
                      <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                      <dd className="font-medium">{movie.status}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-gray-500 dark:text-gray-400">Budget</dt>
                      <dd className="font-medium">{formatCurrency(movie.budget)}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-gray-500 dark:text-gray-400">Revenue</dt>
                      <dd className="font-medium">{formatCurrency(movie.revenue)}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h2 className="text-xl font-heading font-semibold mb-3">Production</h2>
                  <div className="space-y-4">
                    {movie.production_companies.map(company => (
                      <div key={company.id} className="flex items-center">
                        {company.logo_path ? (
                          <img 
                            src={getImageUrl(company.logo_path, 'w200')} 
                            alt={company.name}
                            className="h-8 mr-2 bg-white rounded p-1"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 dark:bg-primary-700 rounded mr-2 flex items-center justify-center text-sm font-bold">
                            {company.name.charAt(0)}
                          </div>
                        )}
                        <span>{company.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Review Form Section */}
      {user && (
        <section className="mt-12 mb-8 container-custom mx-auto">
          <h2 className="text-xl font-heading font-semibold mb-3">Tu reseña</h2>
          
          {reviewSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg">
              <p>¡Reseña publicada correctamente!</p>
            </div>
          )}
          
          {reviewError && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p>{reviewError}</p>
            </div>
          )}
          
          <form
            onSubmit={handleReviewSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Título"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <textarea
              placeholder="Contenido de la reseña"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              className="w-full px-4 py-2 border rounded text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              required
            />
            <div>
              <label className="block mb-1 font-medium">Tu calificación:</label>
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
              disabled={submittingReview}
            >
              {submittingReview ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </form>
        </section>
      )}
      
      {/* Reseñas */}
      <div className="mt-12 container-custom mx-auto pb-16">
        <h2 className="text-xl font-heading font-semibold mb-3">Reseñas de usuarios</h2>
        {!user && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-primary-800/50 rounded-lg">
            <p>Inicia sesión para añadir tu reseña sobre esta película.</p>
          </div>
        )}
        <div className="space-y-6">
          {userReviews.length === 0 && <p>No hay reseñas aún. ¡Sé el primero en opinar!</p>}
          {userReviews.map(review => (
            <div key={review.id} className="p-5 border rounded-lg bg-white dark:bg-primary-800 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{review.title}</h3>
                  <Link to={review.user?.id ? `/perfil/${review.user.id}` : '#'} className="text-primary-600 hover:underline">
                    {review.user?.name || review.user?.email || 'Usuario'}
                  </Link>
                </div>
                <div>
                  <StarRating value={review.rating} readOnly size={20} />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MovieDetailsPage;