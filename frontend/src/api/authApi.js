import apiClient from "./apiClient";

export async function login(email, password) {
  return apiClient.post("/auth/login", { email, password });
}

export async function logout() {
  return apiClient.post("/auth/logout");
}

export async function getCurrentUser() {
  return apiClient.get("/auth/me");
}

export default {
  login,
  logout,
  getCurrentUser,
};
