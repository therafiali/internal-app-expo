import { QueryProvider } from "@/components/QueryProvider";
import { PlayerProvider } from "@/context/PlayerContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <QueryProvider>
      <PlayerProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PlayerProvider>
    </QueryProvider>
  );
}
