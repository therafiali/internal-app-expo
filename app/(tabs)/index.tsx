import RechargeButton from "@/components/RechargeButton";
import RedeemButton from "@/components/RedeemButton";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>Welcome Home!</Text>
      
      <RechargeButton />
      <RedeemButton />
    </View>
  );
}
