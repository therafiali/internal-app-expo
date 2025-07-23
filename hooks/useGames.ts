import { useState } from "react";
import { supabase } from "../lib/supabase";

export interface Game {
  id: string;
  created_at: string;
  game_name: string | null;
  game_url: string | null;
  game_logo_url: string | null;
  game_username: string | null; // Player's username in this game
}

export function useGames() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  // Fetch all games with player's username in each game
  const fetchGames = async (playerId?: string) => {
    setLoading(true);
    setError(null);
    
    let query = supabase
      .from("games")
      .select(`
        id, 
        created_at, 
        game_name, 
        game_url, 
        game_logo_url,
        player_platfrom_usernames!left(game_username)
      `);
    
    if (playerId) {
      query = query.eq('player_platfrom_usernames.player_id', playerId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      setError(error.message);
    } else {
      // Format the data to flatten the game_username
      const formattedData = data?.map(game => ({
        id: game.id,
        created_at: game.created_at,
        game_name: game.game_name,
        game_url: game.game_url,
        game_logo_url: game.game_logo_url,
        game_username: game.player_platfrom_usernames?.[0]?.game_username || null
      })) || [];
      
      setGames(formattedData);
    }
    
    setLoading(false);
    return data;
  };

  return { games, loading, error, fetchGames };
} 