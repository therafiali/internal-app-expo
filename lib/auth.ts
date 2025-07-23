import * as SecureStore from "expo-secure-store";
import { Player } from "@/context/PlayerContext";

export async function logout(
  setPlayer: (player: Player | null) => void,
  setIsLoggedIn: (isLoggedIn: boolean) => void
) {
  await SecureStore.deleteItemAsync("username");
  await SecureStore.deleteItemAsync("password");
  setPlayer(null);
  setIsLoggedIn(false);
}
