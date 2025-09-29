import { createContext, useContext, useState } from "react";
import type {ReactNode } from "react";

interface RoomContextType {
  roomId: string;
  setRoomId: (id: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState<string>("");

  return (
    <RoomContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};

// Custom hook for easier usage
export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
