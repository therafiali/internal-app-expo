import * as Crypto from "expo-crypto";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import * as SecureStore from "expo-secure-store";

// Hash password using SHA-256
const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

export function usePlayer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<
    { username: string; password: string }[]
  >([]);

  // Fetch all players
  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("player")
      .select("username, password");
    if (error) setError(error.message);
    setPlayers(data || []);
    setLoading(false);
    return data;
  };

  // Insert a new player (hash password before storing)
  const insertPlayer = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    const hashedPassword = await hashPassword(password);
    const { error } = await supabase
      .from("players")
      .update({ password: hashedPassword })
      .eq("id", "cdae7c5c-5897-4489-95ad-afab89d01f99");
    if (error) setError(error.message);
    setLoading(false);
    return !error;
  };

  return { players, loading, error, fetchPlayers, insertPlayer };
}

export const isPlayerUsernamePasswordValid = async (
  username: string,
  password: string
) => {
  const storedUsername = await SecureStore.getItemAsync("username");
  const storedPassword = await SecureStore.getItemAsync("password");
  const { data, error } = await supabase
    .from("players")
    .select("username, password, fullname")
    .eq("username", storedUsername);
  // check if the password is valid
  if (data && data.length > 0) {
    const inputHash = await hashPassword(storedPassword || "");
    return inputHash === data[0].password;
  }
  if (error) throw error;
  return false;
};
