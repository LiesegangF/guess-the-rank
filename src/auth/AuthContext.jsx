import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login as doLogin, logout as doLogout } from "./auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (username, password) => {
    const success = doLogin(username, password);
    if (success) setUser(getCurrentUser());
    return success;
  };

  const logout = () => {
    doLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
