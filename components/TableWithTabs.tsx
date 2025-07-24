import {
  RedeemRequest,
  useRedeemRequests,
} from "@/hooks/useRedeemRequests";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "./ThemedView";

const TABS = ["Pending", "Live", "Completed"] as const;
type TabType = (typeof TABS)[number];

const statusMap: Record<TabType, string[]> = {
  Pending: ["0"],
  Live: ["1", "2", "3"],
  Completed: ["4"],
};

const statusColors: Record<string, string> = {
  pending: "#EAB308", // yellow
  live: "#2563EB", // blue
  completed: "#22C55E", // green
  Critical: "#E11D48", // red
};

function StatusBadge({ status }: { status?: string }) {
  const color = statusColors[status?.toLowerCase?.() || "pending"] || "#E5E7EB";
  return (
    <View
      style={[
        styles.statusBadge,
        { borderColor: color, backgroundColor: color + "22" },
      ]}
    >
      {" "}
      {/* 22 for light bg */}
      <Text style={[styles.statusBadgeText, { color }]}>{status}</Text>
    </View>
  );
}

function RequestCard({
  notif,
  onPress,
}: {
  notif: RedeemRequest;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCol}>
          <Text style={styles.bellIcon}>💰</Text>
        </View>
        <View style={styles.cardContentCol}>
          <Text style={styles.title}>
            Redeem Request
          </Text>
          <Text style={styles.subtitle}>
            Platform: {notif.games?.game_name || "Unknown"}
          </Text>
          <Text style={styles.detail}>
            Amount: <Text style={styles.amount}>${notif.total_amount}</Text>
          </Text>
        </View>
        <View style={styles.cardMetaCol}>
          <Text style={styles.time}>
            {notif.created_at
              ? new Date(notif.created_at).toLocaleString()
              : ""}
          </Text>
          <StatusBadge status={notif.process_status} />
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TableWithTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const router = useRouter();
  const { data, isLoading, error } = useRedeemRequests(
    statusMap[activeTab]
  );

  const handleCardPress = (notif: RedeemRequest) => {
    router.push({
      pathname: "/request-detail",
      params: { request: JSON.stringify(notif) },
    });
  };

  return (
    <ThemedView style={styles.wrapper}>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Notification Cards */}
      <View style={styles.listWrapper}>
        {isLoading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}
        {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
        {data && data.length === 0 && (
          <View style={styles.emptyStateWrapper}>
            <Text style={styles.emptyStateText}>No requests found.</Text>
          </View>
        )}
        {data &&
          data.map((notif) => (
            <RequestCard
              key={notif.id}
              notif={notif}
              onPress={() => handleCardPress(notif)}
            />
          ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 16,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    marginHorizontal: 2,
    elevation: 0,
  },
  activeTab: {
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: "#fff",
  },
  listWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 8,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  errorText: {
    color: "#E11D48",
    textAlign: "center",
    marginTop: 24,
    fontWeight: "bold",
  },
  emptyStateWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: "column",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  iconCol: {
    alignItems: "center",
    marginRight: 10,
    width: 32,
  },
  bellIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  screenshotIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  cardContentCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  subtitle: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  detail: {
    color: "#444",
    fontSize: 13,
    marginBottom: 1,
  },
  amount: {
    color: "#22C55E",
    fontWeight: "bold",
  },
  notes: {
    color: "#EAB308",
    fontSize: 13,
    marginTop: 2,
    fontStyle: "italic",
  },
  cardMetaCol: {
    alignItems: "flex-end",
    minWidth: 80,
    marginLeft: 8,
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginBottom: 2,
    textAlign: "right",
  },
  updatedTime: {
    color: "#94A3B8",
    fontSize: 11,
    marginBottom: 4,
    textAlign: "right",
  },
  statusBadge: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 2,
    marginBottom: 2,
    alignSelf: "flex-end",
    backgroundColor: "#F2F4F7",
  },
  statusBadgeText: {
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "capitalize",
  },
  chevron: {
    fontSize: 28,
    color: "#CBD5E1",
    marginTop: 8,
    marginRight: -4,
  },
});
