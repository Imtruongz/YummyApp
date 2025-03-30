// src/contexts/AuthContext.tsx
import { createContext, useContext } from "react";

interface AuthContextType {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);