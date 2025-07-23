import { Player } from "@/context/PlayerContext";
import { removeItem } from "./storage";

export async function logout(
  setPlayer: (player: Player | null) => void,
  setIsLoggedIn: (isLoggedIn: boolean) => void
) {
  await removeItem("username");
  await removeItem("password");
  setPlayer(null);
  setIsLoggedIn(false);
}
