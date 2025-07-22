import { useCallback } from "react";
import { useAuthContext } from "./AuthContext";

export const useAuth = () => {
  const { token, setToken, isAuthenticated, logout } = useAuthContext();

  // Accepts a token and stores it
  const login = useCallback(
    (token: string) => {
      setToken(token);
    },
    [setToken]
  );

  return { token, isAuthenticated, login, logout };
};
