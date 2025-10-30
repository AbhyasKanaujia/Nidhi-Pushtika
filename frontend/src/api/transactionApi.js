import apiClient from "./apiClient";

// Transactions API

export async function getTransactions(params) {
  // params can include filters like date range, pagination, etc.
  return apiClient.get("/transactions", { params });
}

export async function getTransactionById(id) {
  return apiClient.get(`/transactions/${id}`);
}

export async function createTransaction(data) {
  return apiClient.post("/transactions", data);
}

export async function updateTransaction(id, data) {
  return apiClient.put(`/transactions/${id}`, data);
}

export async function deleteTransaction(id) {
  return apiClient.delete(`/transactions/${id}`);
}

export default {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
