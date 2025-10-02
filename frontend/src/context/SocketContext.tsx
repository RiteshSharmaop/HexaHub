import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface SocketContextType {
  socketId: string | undefined;  // allow undefined
  setSocketId: (id: string | undefined) => void; // allow undefined
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  // const [socketId, setSocketId] = useState<string>("");
  const [socketId, setSocketId] = useState<string | undefined>(undefined);


  return (
    <SocketContext.Provider value={{ socketId, setSocketId }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for easier usage
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
