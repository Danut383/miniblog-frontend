import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  getUserReviews,
  getUserComments,
  editComment,
  deleteComment,
  editReview,
  deleteReview,
  getImageUrl
} from '../services/api';
import StarRating from '../components/ui/StarRating';

const ProfilePage: React.FC = () => {
  const { user, token, signOut } = useAuthStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editReviewId, setEditReviewId] = useState<number | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const [userReviews, userComments] = await Promise.all([
          getUserReviews(token),
          getUserComments(token),
        ]);
        setReviews(userReviews);
        setComments(userComments);
      } catch (err) {}
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleEditReview = async (reviewId: number) => {
    if (!token) return;
    await editReview(reviewId, {
      title: reviewTitle,
      content: reviewContent,
      rating: reviewRating,
    }, token);
    setEditReviewId(null);
    setReviewTitle('');
    setReviewContent('');
    setReviewRating(0);
    const userReviews = await getUserReviews(token);
    setReviews(userReviews);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!token) return;
    await deleteReview(reviewId, token);
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const handleEditComment = async (commentId: number) => {
    if (!token) return;
    await editComment(commentId, editContent, token);
    setEditCommentId(null);
    setEditContent('');
    const userComments = await getUserComments(token);
    setComments(userComments);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;
    await deleteComment(commentId, token);
    setComments(comments.filter(c => c.id !== commentId));
  };

  if (!user) return <div className="p-8">Inicia sesión para ver tu perfil.</div>;
  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
      <h1 className="text-2xl font-bold mb-6">Perfil de {user.name || user.email}</h1>
      <button onClick={signOut} className="mb-8 px-4 py-2 bg-red-500 text-white rounded">
        Cerrar sesión
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-4">Tus Reseñas</h2>
      {reviews.length === 0 ? (
        <div className="p-4 bg-gray-50 dark:bg-primary-800/50 rounded-lg text-center mb-12">
          No tienes reseñas aún. ¡Comienza compartiendo tu opinión sobre alguna película!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-primary-800 rounded-lg shadow-md overflow-hidden">
              {editReviewId === review.id ? (
                <div className="p-4 space-y-2">
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full border p-2 rounded text-black"
                    placeholder="Título"
                  />
                  <StarRating value={reviewRating} onChange={setReviewRating} />
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full border p-2 rounded text-black"
                    rows={3}
                    placeholder="Contenido"
                  />
                  <div className="flex justify-between mt-2">
                    <button onClick={() => handleEditReview(review.id)} className="px-3 py-1 bg-blue-500 text-white rounded">Guardar</button>
                    <button onClick={() => setEditReviewId(null)} className="px-3 py-1 bg-gray-300 rounded">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Imagen con enlace */}
                  <Link to={`/movie/${review.movieId}`} className="block w-full h-48 overflow-hidden relative">
                    <img
                      src={getImageUrl(review.posterPath || '', 'w500')}
                      alt={review.movieTitle || 'Película'}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {review.movieTitle && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 truncate">
                        {review.movieTitle}
                      </div>
                    )}
                  </Link>
                
                  <div className="p-4">
                    <div className="font-bold text-lg mb-1">{review.title || 'Sin título'}</div>
                    {review.rating > 0 && (
                      <div className="mb-2">
                        <StarRating value={review.rating} readOnly size={20} />
                      </div>
                    )}
                    <div className="mb-4 text-gray-800 dark:text-gray-200">{review.content}</div>
                    <div className="text-sm text-gray-500 mb-3">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => {
                        setEditReviewId(review.id);
                        setReviewTitle(review.title);
                        setReviewContent(review.content);
                        setReviewRating(review.rating);
                      }} className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
                      <button onClick={() => handleDeleteReview(review.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                      <Link to={`/movie/${review.movieId}`} className="px-3 py-1 bg-primary-600 text-white rounded">
                        Ver película
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Tus Comentarios</h2>
      {comments.length === 0 ? (
        <div className="p-4 bg-gray-50 dark:bg-primary-800/50 rounded-lg text-center">
          No tienes comentarios aún.
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-primary-800 rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                {comment.review?.posterPath && (
                  <Link to={`/movie/${comment.review?.movieId}`} className="mr-3">
                    <img 
                      src={getImageUrl(comment.review?.posterPath, 'w92')} 
                      alt="Poster" 
                      className="w-12 h-16 object-cover rounded"
                    />
                  </Link>
                )}
                <div>
                  <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    Comentario en reseña:
                  </div>
                  <Link to={`/reviews/${comment.reviewId}`} className="font-semibold hover:text-primary-500 transition-colors">
                    {comment.review?.title || 'Reseña sin título'}
                  </Link>
                </div>
              </div>
              
              {editCommentId === comment.id ? (
                <div>
                  <textarea
                    className="w-full border rounded p-2 mb-2 text-black"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <button onClick={() => handleEditComment(comment.id)} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">Guardar</button>
                    <button onClick={() => setEditCommentId(null)} className="px-3 py-1 bg-gray-300 rounded">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3">{comment.content}</div>
                  <div className="text-xs text-gray-500 mb-3">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => {
                      setEditCommentId(comment.id);
                      setEditContent(comment.content);
                    }} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
                    <button onClick={() => handleDeleteComment(comment.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
