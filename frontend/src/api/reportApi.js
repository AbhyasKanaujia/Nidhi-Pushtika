import apiClient from "./apiClient";

// Reports API

export async function getSummary(filters) {
  const params = {};
  if (filters?.from) params.from = filters.from;
  if (filters?.to) params.to = filters.to;

  return apiClient.get("/reports/summary", { params });
}

export default {
  getSummary,
};
