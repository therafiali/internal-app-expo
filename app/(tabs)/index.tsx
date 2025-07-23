import LoginForm from "@/components/LoginForm";
import { isPlayerUsernamePasswordValid } from "@/hooks/usePlayer";
import { getCredientials } from "@/lib/credentials";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlreadyHasCredentials, setIsAlreadyHasCredentials] = useState(true);

  useEffect(() => {

    // first check in local storage if yes 
    async function checkCredentials() {
      const credentials = await getCredientials();
      if (credentials) {
        const isUsernamePasswordValid = await isPlayerUsernamePasswordValid(
          credentials.username,
          credentials.password
        );
        if (isUsernamePasswordValid) {
          setIsLoggedIn(true);
        }
      }
      setIsAlreadyHasCredentials(false);
    }
    checkCredentials();
  }, []);

  if (isAlreadyHasCredentials) {
    return <Text>Loading...</Text>;
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Welcome Rafi!</Text>
    </View>
  );
}
