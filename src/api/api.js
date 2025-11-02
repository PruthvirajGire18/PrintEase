import axios from "axios";

const API = axios.create({
  baseURL: "https://print-ease-backend-tau.vercel.app/api", // backend URL
});

// Add token automatically if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
