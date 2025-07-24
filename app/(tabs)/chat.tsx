import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { usePlayerContext } from "@/context/PlayerContext";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ChatScreen() {
  const {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    findOrCreateRoom,
  } = useChat();
  const [roomId, setRoomId] = useState<string | null>(null);

  // Using proper UUID format for testing - replace with actual logged in player data
    const { player } = usePlayerContext();
  useEffect(() => {
    const initializeChat = async () => {
      if (player?.id) {
        const playerRoomId = await findOrCreateRoom(player.id);
        if (playerRoomId) {
          setRoomId(playerRoomId);
          await fetchMessages(playerRoomId);
        }
      }
    };

    initializeChat();
  }, [player?.id]);

  // Poll for new messages every 2 seconds when roomId is set
  // useEffect(() => {
  //   if (!roomId) return;
  //   const interval = setInterval(() => {
  //     fetchMessages(roomId);
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, [roomId, fetchMessages]);

  const handleSendMessage = async (messageText: string) => {
    if (roomId) {
      await sendMessage(roomId, player?.id, messageText, "player");
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender_type === "player";
    const timestamp = new Date(item.created_at).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <ChatMessage
        message={item.body || ""}
        isUser={isUser}
        timestamp={timestamp}
        senderName={isUser ? undefined : "Agent"}
      />
    );
  };

  if (!player?.id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support Chat</Text>
          <Text style={styles.headerStatus}>● Offline</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please login to access chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && (!roomId || messages.length === 0)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support Chat</Text>
          <Text style={styles.headerStatus}>● Online</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support Chat</Text>
          <Text style={styles.headerStatus}>● Offline</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Chat</Text>
        <Text style={styles.headerStatus}>● Online</Text>
      </View>

      {/* Messages */}
      <FlatList
        style={styles.messagesList}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#075E54",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  headerStatus: {
    color: "#4FC3F7",
    fontSize: 14,
    fontWeight: "500",
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  messagesContent: {
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
