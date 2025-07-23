import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type RequestDetailProps = {
  request: {
    id: string;
    title: string;
    originator: string;
    time: string;
    status: "Critical" | "Normal";
    // Add more fields as needed
  };
};

export default function RequestDetail({ request }: RequestDetailProps) {
  return (
    <ThemedView style={styles.wrapper}>
      <ThemedText type="title" style={styles.title}>
        {request.title}
      </ThemedText>
      <ThemedText style={styles.label}>Originator:</ThemedText>
      <ThemedText style={styles.value}>{request.originator}</ThemedText>
      <ThemedText style={styles.label}>Time:</ThemedText>
      <ThemedText style={styles.value}>{request.time}</ThemedText>
      <ThemedText style={styles.label}>Status:</ThemedText>
      <ThemedText
        style={[styles.value, request.status === "Critical" && styles.critical]}
      >
        {request.status}
      </ThemedText>
      <View style={styles.section}>
        <ThemedText style={styles.label}>More Details:</ThemedText>
        <ThemedText style={styles.value}>
          This is a placeholder for additional request details.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    color: "#666",
    marginTop: 12,
    fontSize: 15,
  },
  value: {
    color: "#222",
    fontSize: 16,
    marginTop: 2,
  },
  critical: {
    color: "#E11D48",
    fontWeight: "bold",
  },
  section: {
    marginTop: 24,
  },
});
