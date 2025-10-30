import { useState, useEffect } from "react";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionApi";

export function useTransactions(params) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTransactions(params)
      .then((response) => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [params]);

  const addTransaction = async (data) => {
    setLoading(true);
    try {
      const response = await createTransaction(data);
      setTransactions((prev) => [...prev, response.data]);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const editTransaction = async (id, data) => {
    setLoading(true);
    try {
      const response = await updateTransaction(id, data);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const removeTransaction = async (id) => {
    setLoading(true);
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    editTransaction,
    removeTransaction,
  };
}

export default useTransactions;
