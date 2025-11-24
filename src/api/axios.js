import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-sa-civ6.onrender.com",
});

export default api;