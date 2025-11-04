import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../Components/ForAPIs";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Attach token automatically to every request
  axios.interceptors.request.use((config) => {
    const customerToken = localStorage.getItem("customerToken");
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    }
    return config;
  });

  // ✅ Fetch current user using Authorization header
  const fetchCurrentUser = async () => {
    const customerToken = localStorage.getItem("customerToken");
    if (!customerToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${endPoint}/user/me/customer`);
      setUser(data.user);
    } catch (err) {
      console.error("Fetch current user error:", err.response?.data || err.message);
      localStorage.removeItem("customerToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Auto-run on page load
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 🧾 Signup (no token saved)
  const signup = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${endPoint}/user/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // ✅ Only registers user; no auto-login
      return data;
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Login
  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${endPoint}/user/login`, formData);
      localStorage.setItem("customerToken", data.token); // ✅ store token
      setUser(data.user);
      return data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    localStorage.removeItem("customerToken");
    setUser(null);
  };

  const authInfo = { user, loading, signup, login, logout, fetchCurrentUser };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
