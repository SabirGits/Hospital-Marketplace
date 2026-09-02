import { createContext, useContext, useState, useCallback } from "react";
import { loginUser, registerUser, adminLogin as adminLoginApi, loginWithGoogle, patientLogin as patientLoginApi, setAuthToken } from "../api/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "hm_auth";

// Reads any saved session synchronously, before the first render — restoring
// it inside a useEffect instead (as this used to) creates a real race: on a
// page refresh, the very first render sees user=null before the effect runs,
// so a route guard like RequireRole bounces an already-logged-in person to
// /login for a frame (and any dashboard effect that fires in that window
// calls the API with no auth header yet). Reading localStorage here avoids
// that entirely.
function restoreSession() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    const { token, user } = JSON.parse(saved);
    setAuthToken(token);
    return user;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreSession); // { name, email, role, id, ... }
  const [authError, setAuthError] = useState(null);

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
