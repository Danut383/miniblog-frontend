import axios from "axios";

const API_KEY = "5e44ab7258d398471596fe9f41cf43af";
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error al buscar películas en TMDb:", error);
    return [];
  }
};
