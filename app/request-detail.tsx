import RequestDetail from "@/components/RequestDetail";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RequestDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the request data from params (assume it's passed as a JSON string)
  let request = null;
  try {
    request = params.request ? JSON.parse(params.request as string) : null;
  } catch {
    request = null;
  }

  if (!request) {
    return (
      <View style={styles.centered}>
        <Text>Invalid request data.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>{"< Back"}</Text>
        </TouchableOpacity>
      </View>
      <RequestDetail request={request} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    fontSize: 16,
    color: "#1A56DB",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
