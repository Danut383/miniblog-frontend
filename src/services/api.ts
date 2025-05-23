import axios from 'axios';
import { MovieDetails, MoviesResponse } from '../types/movie';

// TMDB Configuration - Usar variable de entorno o fallback
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzc2ZGU5OTdhM2ZlYmYwOWJmMDVmOTQ0MTY3OTA2YyIsIm5iZiI6MTczNDc3MTk0My41NzEsInN1YiI6IjY3NWM0M2RkYzkzNTRkZmQ3YWE4MzcxMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YHAfwV-GKhSjIE-Tr8rPZs1MXJPOhXo6fUOixvQdKZs';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Authorization': `Bearer ${TMDB_API_KEY}`,
    'accept': 'application/json'
  }
});

// Normally, API keys should be handled by a backend service
// For demonstration purposes, we'll use a free API key (limited functionality)
const API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPopularMovies = async (page: number = 1): Promise<MoviesResponse> => {
  try {
    const response = await api.get<MoviesResponse>('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getTopRatedMovies = async (page: number = 1): Promise<MoviesResponse> => {
  try {
    const response = await api.get<MoviesResponse>('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getUpcomingMovies = async (page: number = 1): Promise<MoviesResponse> => {
  try {
    const response = await api.get<MoviesResponse>('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  try {
    const response = await api.get<MovieDetails>(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for id ${id}:`, error);
    throw error;
  }
};

// --- TMDB API FUNCTIONS ---
export const searchMovies = async (query: string): Promise<MoviesResponse> => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: query.trim(),
        include_adult: false,
        language: 'es-ES',
        page: 1
      }
    });
    
    console.log(`Búsqueda realizada para: "${query}", encontrados: ${response.data.results?.length || 0} resultados`);
    return response.data;
  } catch (error) {
    console.error('Error en búsqueda de películas:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<MoviesResponse> => {
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      language: 'es-ES'
    }
  });
  return response.data;
};

export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// --- BACKEND API ---
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://backendminiblog.onrender.com/api';

export const backendApi = axios.create({
  baseURL: BACKEND_URL,
});

// Interceptor para mejorar el manejo de errores
backendApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Error de API:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth
export const register = async (email: string, password: string, name: string) => {
  const res = await backendApi.post('/auth/register', { email, password, name });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await backendApi.post('/auth/login', { email, password });
  return res.data;
};

/**
 * Función robusta para obtener reseñas de películas que intenta varios endpoints
 * y maneja errores de forma elegante
 */
export const getMovieReviews = async (movieId: number | string): Promise<any[]> => {
  const endpoints = [
    `/reviews/movie/${movieId}`, 
    `/reviews/${movieId}`, 
    `/reviews?movieId=${movieId}`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Intentando obtener reseñas desde: ${endpoint}`);
      const response = await backendApi.get(endpoint);
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Éxito! Se encontraron ${response.data.length} reseñas`);
        return response.data;
      } else if (response.data && response.data.reviews && Array.isArray(response.data.reviews)) {
        console.log(`Éxito! Se encontraron ${response.data.reviews.length} reseñas`);
        return response.data.reviews;
      } else {
        console.warn(`El endpoint ${endpoint} no devolvió un array:`, response.data);
      }
    } catch (error: any) {
      console.warn(`Error al intentar ${endpoint}:`, error.response?.status || error.message);
      // Continuamos con el siguiente endpoint
    }
  }
  
  // Si todos los endpoints fallan, devolvemos un array vacío
  console.log('No se pudieron obtener reseñas de ningún endpoint. Devolviendo array vacío.');
  return [];
};

/**
 * Función robusta para crear o actualizar una reseña con mejor manejo de errores
 */
export const createReview = async (
  data: { 
    movieId: number, 
    title: string, 
    content: string, 
    rating: number, 
    posterPath?: string,
    movieTitle?: string 
  }, 
  token: string
): Promise<any> => {
  try {
    // Validar datos antes de enviar
    if (!data.title || !data.content || !token) {
      throw new Error('Faltan datos requeridos: título, contenido o token');
    }

    // Aseguramos que movieId sea un número
    const reviewData = {
      movieId: Number(data.movieId),
      title: data.title.trim(),
      content: data.content.trim(),
      rating: Number(data.rating) || 0,
      posterPath: data.posterPath || '',
      movieTitle: data.movieTitle || ''
    };
    
    console.log('Creando reseña con datos:', reviewData);
    
    const response = await backendApi.post('/reviews', reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 segundos de timeout
    });
    
    console.log('Reseña creada exitosamente:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear reseña:', error.response?.data || error.message);
    
    // Mejor manejo de errores específicos
    if (error.response?.status === 409) {
      throw new Error('Ya tienes una reseña para esta película');
    } else if (error.response?.status === 401) {
      throw new Error('No estás autorizado. Por favor inicia sesión nuevamente');
    } else if (error.response?.status === 400) {
      throw new Error('Datos inválidos. Verifica que todos los campos estén completos');
    } else if (error.response?.status >= 500) {
      throw new Error('Error del servidor. Inténtalo de nuevo más tarde');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('La conexión tardó demasiado. Verifica tu internet');
    }
    
    throw error;
  }
};

// Reviews
export const getUserReviews = async (token: string) => {
  try {
    const res = await backendApi.get('/reviews/user/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Error obteniendo reseñas del usuario:', error);
    return [];
  }
};

// Comments
export const getUserComments = async (token: string) => {
  try {
    const res = await backendApi.get('/comments/user/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Error obteniendo comentarios del usuario:', error);
    return []; // Devolver array vacío para evitar errores en el frontend
  }
};

export const editComment = async (commentId: number, content: string, token: string) => {
  try {
    const res = await backendApi.put(`/comments/${commentId}`, { content }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Error al editar comentario:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: number, token: string) => {
  try {
    const res = await backendApi.delete(`/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    throw error; // Mantenemos el throw para que los componentes puedan manejar el error
  }
};

// --- FAVORITOS API ---
export const getFavorites = async (token: string) => {
  const response = await backendApi.get('/favorites/user', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const checkIfFavorite = async (movieId: number, token: string) => {
  const response = await backendApi.get(`/favorites/check/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.isFavorite;
};

export const toggleFavorite = async (
  movieId: number, 
  movieTitle: string, 
  posterPath: string, 
  token: string
) => {
  const response = await backendApi.post('/favorites/toggle', {
    movieId,
    movieTitle,
    posterPath
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// Función para obtener reseñas de forma local cuando la API falla
export const getMovieReviewsWithFallback = async (movieId: number | string): Promise<any[]> => {
  try {
    // Intentar obtener reseñas del backend
    return await getMovieReviews(movieId);
  } catch (error) {
    console.log('Implementando fallback para reseñas');
    
    // Si todo falla, crear datos locales temporales para no romper la UI
    return [
      // Este array vacío permite que la aplicación funcione incluso cuando la API falla
    ];
  }
};

// Función de creación de reseña con fallback mejorado
export const createReviewWithFallback = async (
  data: { 
    movieId: number, 
    title: string, 
    content: string, 
    rating: number, 
    posterPath?: string,
    movieTitle?: string 
  }, 
  token: string,
  currentUser?: any
): Promise<any> => {
  try {
    // Intentar usar el API real
    return await createReview(data, token);
  } catch (error: any) {
    console.error('Creación de reseña falló:', error.message);
    
    // Solo crear fallback local en casos específicos
    if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
      console.log('Implementando fallback local debido a error del servidor');
      
      // Crear un objeto de reseña local para simular respuesta exitosa
      return {
        id: `local_${Date.now()}`,
        title: data.title,
        content: data.content,
        rating: data.rating,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: currentUser?.id || 999999,
        movieId: data.movieId,
        posterPath: data.posterPath,
        movieTitle: data.movieTitle,
        isLocal: true,
        user: {
          id: currentUser?.id || 999999,
          name: currentUser?.name || 'Usuario actual',
          email: currentUser?.email || 'usuario@ejemplo.com'
        }
      };
    }
    
    // Para otros errores, relanzar el error para que lo maneje el componente
    throw error;
  }
};

// Helper: get or create review for a movie and user
export const getOrCreateReview = async (movieId: number, token: string) => {
  const res = await backendApi.post('/reviews/get-or-create', { movieId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const editReview = async (
  reviewId: number,
  data: { title: string; content: string; rating: number },
  token: string
) => {
  const res = await backendApi.put(`/reviews/${reviewId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteReview = async (reviewId: number, token: string) => {
  const res = await backendApi.delete(`/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
