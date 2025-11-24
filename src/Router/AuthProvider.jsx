import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../Components/ForAPIs";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("customerToken") || null);
  const [loading, setLoading] = useState(true);

  // Attach token automatically
  axios.interceptors.request.use((config) => {
    const savedToken = localStorage.getItem("customerToken");
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    return config;
  });

  // Fetch current user
  const fetchCurrentUser = async () => {
    const savedToken = localStorage.getItem("customerToken");
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${endPoint}/user/me/customer`);
      setUser(data.user);
      setToken(savedToken);
    } catch (err) {
      console.error("Fetch user error:", err.response?.data || err.message);
      localStorage.removeItem("customerToken");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Signup
  const signup = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${endPoint}/user/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${endPoint}/user/login`, formData);

      localStorage.setItem("customerToken", data.token);
      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("customerToken");
    setToken(null);
    setUser(null);
  };

  // RETURN TOKEN HERE 🔥🔥🔥
  const authInfo = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
