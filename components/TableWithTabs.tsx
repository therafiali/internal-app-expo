import {
  RechargeRequest,
  useRechargeRequests,
} from "@/hooks/useRechargeRequests";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "./ThemedView";

const TABS = ["Pending", "Live", "Completed"] as const;
type TabType = (typeof TABS)[number];

const statusMap: Record<TabType, string> = {
  Pending: "pending",
  Live: "live",
  Completed: "completed",
};

export default function TableWithTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("Pending");
  const router = useRouter();
  const { data, isLoading, error } = useRechargeRequests(statusMap[activeTab]);

  const handleCardPress = (notif: RechargeRequest) => {
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
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>Error: {error.message}</Text>}
        {data && data.length === 0 && <Text>No requests found.</Text>}
        {data &&
          data.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.card,
                notif.process_status === "Critical" && styles.criticalCard,
              ]}
              activeOpacity={0.85}
              onPress={() => handleCardPress(notif)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.bellIcon}>🔔</Text>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>
                    {notif.recharge_id || "Recharge Request"}
                  </Text>
                  <Text style={styles.subtitle}>
                    Originator: {notif.player_id}
                  </Text>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.time}>
                    {notif.created_at
                      ? new Date(notif.created_at).toLocaleString()
                      : ""}
                  </Text>
                  <View style={styles.statusBadgeWrapper}>
                    <Text style={styles.statusBadge}>
                      {notif.process_status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#1A56DB",
  },
  tabText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
  },
  listWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  criticalCard: {
    borderColor: "#E11D48",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bellIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
  },
  cardMeta: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  time: {
    color: "#888",
    fontSize: 13,
    marginBottom: 6,
  },
  statusBadgeWrapper: {
    alignItems: "flex-end",
  },
  statusBadge: {
    color: "#E11D48",
    fontWeight: "bold",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#E11D48",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: "hidden",
  },
});
