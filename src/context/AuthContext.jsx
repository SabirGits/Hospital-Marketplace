import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { loginUser, registerUser, adminLogin as adminLoginApi, loginWithGoogle, patientLogin as patientLoginApi, setAuthToken } from "../api/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "hm_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email, role, id, ... }
  const [authError, setAuthError] = useState(null);

  // Restore session on page load (token + user were saved after a real login).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { token, user: savedUser } = JSON.parse(saved);
        setAuthToken(token);
        setUser(savedUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null);
    try {
      const res = await loginUser({ email, password });
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }));
      return res.user;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Login failed. Check your email and password.";
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const adminLogin = useCallback(async ({ email, password }) => {
    setAuthError(null);
    try {
      const res = await adminLoginApi({ email, password });
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }));
      return res.user;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Admin login failed.";
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const googleLogin = useCallback(async (credential) => {
    setAuthError(null);
    try {
      const res = await loginWithGoogle(credential);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }));
      return res.user;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Google sign-in failed.";
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const patientLogin = useCallback(async ({ name, email }) => {
    try {
      const res = await patientLoginApi({ name, email });
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }));
      return res.user;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Couldn't continue as patient.";
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError(null);
    try {
      return await registerUser(payload);
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Registration failed.";
      setAuthError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const dashboardPath = () => {
    switch (user?.role) {
      case "hospital": return "/dashboard/hospital";
      case "clinic": return "/dashboard/clinic";
      case "medical": return "/dashboard/medical";
      case "admin": return "/admin";
      case "patient": return "/";
      default: return "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, googleLogin, patientLogin, register, logout, dashboardPath, isAuthenticated: !!user, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
