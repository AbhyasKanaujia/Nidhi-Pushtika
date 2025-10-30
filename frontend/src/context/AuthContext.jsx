
import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, logout as logoutApi, getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user info from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };


  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Optionally handle logout error
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
