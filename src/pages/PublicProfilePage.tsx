import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/ui/StarRating';
import { backendApi, getImageUrl } from '../services/api';

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userRes = await backendApi.get(`/auth/user/${userId}`);
        setUser(userRes.data);

        const reviewsRes = await backendApi.get(`/reviews?userId=${userId}`);
        const validReviews = reviewsRes.data.filter((r: any) => r.rating > 0);
        setReviews(validReviews);
      } catch (err) {
        setUser(null);
        setReviews([]);
      }
      setLoading(false);
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <div className="pt-32 pb-12 text-center">Cargando perfil...</div>;
  if (!user) return <div className="pt-32 pb-12 text-center">Perfil no encontrado.</div>;

  return (
    <main className="pt-32 pb-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Perfil público de {user.name || user.email}</h1>

        <h2 className="text-xl font-semibold mt-8 mb-4">Reseñas</h2>
        {reviews.length === 0 && (
          <div className="p-4 bg-gray-50 dark:bg-primary-800/50 rounded-lg text-center">
            No hay reseñas públicas disponibles.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white dark:bg-primary-800 rounded-lg shadow-md overflow-hidden">
              {/* Imagen de película con enlace */}
              <Link to={`/movie/${review.movieId}`} className="block w-full h-40 overflow-hidden">
                <img
                  src={getImageUrl(review.posterPath || '', 'w500')}
                  alt={review.movieTitle || 'Película'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4">
                <Link
                  to={`/movie/${review.movieId}`}
                  className="font-bold text-lg mb-1 hover:text-primary-500 transition-colors"
                >
                  {review.movieTitle || 'Película sin título'}
                </Link>

                <h3 className="font-semibold text-lg">{review.title || 'Sin título'}</h3>

                {review.rating > 0 && (
                  <div className="my-2">
                    <StarRating value={review.rating} readOnly size={20} />
                  </div>
                )}

                <p className="text-gray-700 dark:text-gray-300 mt-2">{review.content}</p>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PublicProfilePage;
