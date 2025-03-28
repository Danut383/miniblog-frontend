import axios from "axios";

// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default API_URL;
export const getPosts = () => axios.get(`${API_URL}/posts`);
export const getPost = (id) => axios.get(`${API_URL}/posts/${id}`);
export const createPost = (data) => axios.post(`${API_URL}/posts`, data);
export const getReviews = () => axios.get(`${API_URL}/reviews`);
