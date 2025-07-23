import TableWithTabs from "@/components/TableWithTabs";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <TableWithTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
