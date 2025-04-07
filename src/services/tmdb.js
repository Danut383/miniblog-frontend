// 📁 frontend/src/services/tmdb.js
import axios from "axios";

const API_KEY = "5e44ab7258d398471596fe9f41cf43af";
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        include_adult: false,
        language: "es-ES",
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error buscando películas:", err);
    return { results: [] };
  }
};

export const fetchPopularMovies = async (page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: "es-ES",
        page,
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error cargando películas populares:", err);
    return { results: [] };
  }
};
