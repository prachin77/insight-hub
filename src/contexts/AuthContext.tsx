import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { API_BASE_URL } from "@/lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("inkwell_user") || sessionStorage.getItem("inkwell_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((userData: User, rememberMe = false) => {
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem("inkwell_user", JSON.stringify(userData));
      sessionStorage.removeItem("inkwell_user");
    } else {
      sessionStorage.setItem("inkwell_user", JSON.stringify(userData));
      localStorage.removeItem("inkwell_user");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("inkwell_user");
      sessionStorage.removeItem("inkwell_user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
