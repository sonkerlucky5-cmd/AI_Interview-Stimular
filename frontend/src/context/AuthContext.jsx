import { useEffect, useState } from "react";
import {
  getProfileRequest,
  loginRequest,
  logoutRequest,
  signupRequest,
} from "../services/authService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const response = await getProfileRequest();
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    hydrateSession();
  }, []);

  const signup = async (payload) => {
    const response = await signupRequest(payload);
    setUser(response.data.user);
    return response;
  };

  const login = async (payload) => {
    const response = await loginRequest(payload);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const refreshProfile = async () => {
    const response = await getProfileRequest();
    setUser(response.data.user);
    return response.data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isBootstrapping,
        login,
        logout,
        refreshProfile,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
