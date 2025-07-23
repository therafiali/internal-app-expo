import LoginForm from "@/components/LoginForm";
import { usePlayerContext } from "@/context/PlayerContext";
import { isPlayerUsernamePasswordValid, usePlayer } from "@/hooks/usePlayer";
import { logout } from "@/lib/auth";
import { getCredientials } from "@/lib/credentials";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { fetchPlayers } = usePlayer();
  const { player, setPlayer } = usePlayerContext();
  const navigation = useNavigation();

  useEffect(() => {
    // first check in local storage if yes call the api to check if the credentials are valid
    async function checkCredentials() {
      const credentials = await getCredientials();
      if (credentials) {
        const isUsernamePasswordValid = await isPlayerUsernamePasswordValid(
          credentials.username,
          credentials.password
        );
        console.log(isUsernamePasswordValid, "isUsernamePasswordValid");
        if (isUsernamePasswordValid) {
          setIsLoggedIn(true);
          const playerDetails = await fetchPlayers(credentials.username);
          let playerObj = null;
          if (playerDetails && playerDetails[0]) {
            const { teams, ...rest } = playerDetails[0];
            playerObj = {
              ...rest,
              teams: Array.isArray(teams) ? teams[0] : teams,
            };
          }
          setPlayer(playerObj);
          return;
        }
      }
      setPlayer(null); // Allow null in context for logout
      setIsLoggedIn(false);
    }
    checkCredentials();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
  }, [isLoggedIn, navigation]);

  if (!isLoggedIn) {
    // Not logged in, show login form
    return (
      <LoginForm
        onLogin={async () => {
          const credentials = await getCredientials();
          const playerDetails = await fetchPlayers(credentials.username);
          let playerObj = null;
          if (playerDetails && playerDetails[0]) {
            const { teams, ...rest } = playerDetails[0];
            playerObj = {
              ...rest,
              teams: Array.isArray(teams) ? teams[0] : teams,
            };
          }
          setPlayer(playerObj);
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
        {player?.teams?.team_name || "No team"}
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
