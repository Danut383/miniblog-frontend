import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPosts = () => axios.get(`${API_URL}/posts`);
export const getPost = (id) => axios.get(`${API_URL}/posts/${id}`);
export const createPost = (data) => axios.post(`${API_URL}/posts`, data);
export const getReviews = () => axios.get(`${API_URL}/reviews`);
