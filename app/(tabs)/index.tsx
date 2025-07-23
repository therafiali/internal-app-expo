import LoginForm from "@/components/LoginForm";
import { usePlayerContext } from "@/context/PlayerContext";
import { isPlayerUsernamePasswordValid, usePlayer } from "@/hooks/usePlayer";
import { logout } from "@/lib/auth";
import { getCredientials } from "@/lib/credentials";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlreadyHasCredentials, setIsAlreadyHasCredentials] = useState(false);
  const { fetchPlayers } = usePlayer();
  const { player, setPlayer } = usePlayerContext();

  useEffect(() => {
    // first check in local storage if yes call the api to check if the credentials are valid
    async function checkCredentials() {
      const credentials = await getCredientials();
      if (credentials) {
        const isUsernamePasswordValid = await isPlayerUsernamePasswordValid(
          credentials.username,
          credentials.password
        );
        if (isUsernamePasswordValid) {
          setIsLoggedIn(true);
          setIsAlreadyHasCredentials(false);
          const playerDetails = await fetchPlayers(credentials.username);
          setPlayer(
            playerDetails && playerDetails[0] ? playerDetails[0] : null
          );
          return;
        }
      }
      setIsAlreadyHasCredentials(false);
      setPlayer(null); // Allow null in context for logout
      setIsLoggedIn(false);
    }
    checkCredentials();
  }, []);

  if (!isLoggedIn) {
    // Not logged in, show login form
    return (
      <LoginForm
        onLogin={async () => {
          const credentials = await getCredientials();
          const playerDetails = await fetchPlayers(credentials.username);
          setPlayer(
            playerDetails && playerDetails[0] ? playerDetails[0] : null
          );
          setIsLoggedIn(true);
        }}
      />
    );
  }

  console.log(player, "player");
  // If logged in, show main app
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Welcome {player?.fullname?.toUpperCase()}!
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "500", margin: 10 }}>
        {player?.teams?.team_name}
      </Text>
      <Button
        title="Logout"
        onPress={async () => {
          await logout(setPlayer, setIsLoggedIn);
        }}
      />
    </View>
  );
}
