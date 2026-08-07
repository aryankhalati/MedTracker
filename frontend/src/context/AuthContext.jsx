import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    const payload = JSON.parse(atob(res.data.token.split(".")[1]));
    localStorage.setItem("role", payload.role);
    setRole(payload.role);
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post("/auth/verify-otp", { email, otp });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    const payload = JSON.parse(atob(res.data.token.split(".")[1]));
    localStorage.setItem("role", payload.role);
    setRole(payload.role);
  };

  const resendOtp = async (email) => {
    await api.post("/auth/resend-otp", { email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, register, verifyOtp, resendOtp, logout, isAuthenticated: !!token, isAdmin: role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);