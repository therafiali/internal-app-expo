import TableWithTabs from "@/components/TableWithTabs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useGames } from "@/hooks/useGames";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity</Text>
      <TableWithTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    paddingHorizontal: 20,
    letterSpacing: 0.2,
  },
});
