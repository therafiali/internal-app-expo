import React, { createContext, useContext, useState } from "react";

export interface Player {
  gender?: string | null;
  fullname?: string | null;
  username?: string | null;
  profilepic?: string | null;
  team_id?: string | null;
  id: string;
  user_id?: string | null;
  last_login?: string | null;
  active_status?: string | null;
  online_status?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  teams?: {
    team_name?: string | null;
  }[];
}

interface PlayerContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
}

const playerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);

  return (
    <playerContext.Provider value={{ player, setPlayer }}>
      {children}
    </playerContext.Provider>
  );
};

export function usePlayerContext() {
  const context = useContext(playerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
}
