import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  senderName?: string;
}

export default function ChatMessage({ message, isUser, timestamp, senderName }: ChatMessageProps) {
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.agentMessage]}>
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.agentBubble]}>
        {!isUser && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.agentText]}>
          {message}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.agentTimestamp]}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 2,
    marginHorizontal: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  agentMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  agentText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  agentTimestamp: {
    color: '#999',
  },
}); 