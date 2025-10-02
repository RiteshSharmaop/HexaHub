import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Load from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Persist to localStorage when changed
  useEffect(() => {
    if (username) localStorage.setItem("username", username);
    if (email) localStorage.setItem("email", email);
  }, [username, email]);

  return (
    <UserContext.Provider value={{ username, setUsername, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
