import { useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native";

export default function RedeemButton() {
  const router = useRouter();

  const handleRedeemPress = () => {
    router.push("/(tabs)/redeem-flow");
  };

  return <Button title="Redeem" onPress={handleRedeemPress} />;
} 