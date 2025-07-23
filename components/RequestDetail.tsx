import type { RechargeRequest } from "@/hooks/useRechargeRequests";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export type RequestDetailProps = {
  request: RechargeRequest;
};

export default function RequestDetail({ request }: RequestDetailProps) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
    >
      <ThemedView style={styles.wrapper}>
        <ThemedText type="title" style={styles.title}>
          {request.recharge_id || "Recharge Request"}
        </ThemedText>
        <DetailRow label="Player ID" value={request.player_id} />
        {request.team_id && (
          <DetailRow label="Team ID" value={request.team_id} />
        )}
        <DetailRow label="Game ID" value={request.game_id} />
        <DetailRow label="Amount" value={`₹${request.amount}`} />
        <DetailRow
          label="Status"
          value={request.process_status}
          status={request.process_status}
        />
        {request.payment_method_id && (
          <DetailRow label="Payment Method" value={request.payment_method_id} />
        )}
        {request.notes && (
          <DetailRow label="Notes" value={request.notes} isNote />
        )}
        <DetailRow
          label="Created At"
          value={
            request.created_at
              ? new Date(request.created_at).toLocaleString()
              : "-"
          }
        />
        {request.updated_at && (
          <DetailRow
            label="Updated At"
            value={new Date(request.updated_at).toLocaleString()}
          />
        )}
        <DetailRow label="Request ID" value={request.id} />
        {request.screenshot_url && request.screenshot_url.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>Screenshots:</ThemedText>
            <View style={styles.screenshotRow}>
              {request.screenshot_url.map((url, idx) => (
                <Image
                  key={idx}
                  source={{ uri: url }}
                  style={styles.screenshot}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
  status,
  isNote,
}: {
  label: string;
  value?: string;
  status?: string;
  isNote?: boolean;
}) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}:</ThemedText>
      <ThemedText
        style={[
          styles.value,
          isNote && styles.note,
          status === "Critical" && styles.critical,
        ]}
      >
        {value || "-"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    marginBottom: 18,
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#666",
    fontSize: 15,
    minWidth: 120,
  },
  value: {
    color: "#222",
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    flexWrap: "wrap",
  },
  note: {
    color: "#EAB308",
    fontStyle: "italic",
  },
  critical: {
    color: "#E11D48",
    fontWeight: "bold",
  },
  section: {
    marginTop: 18,
  },
  screenshotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  screenshot: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
});
