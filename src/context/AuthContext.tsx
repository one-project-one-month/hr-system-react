// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        await authStore.checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loading, isAuthenticated: authStore.isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
