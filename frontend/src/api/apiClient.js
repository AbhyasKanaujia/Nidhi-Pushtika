import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response && error.response.data) {
      return Promise.reject(new Error(error.response.data.message || "API request failed"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
