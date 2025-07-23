import { useState } from "react";
import { supabase } from "../lib/supabase";

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string | null;
  body: string | null;
  created_at: string;
  sender_type: string | null;
  attachment_url: string | null;
  attachment_type: string | null;
  media: any[] | null;
}

export function useChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Find or create chat room for a player
  const findOrCreateRoom = async (playerId: string) => {
    setLoading(true);
    setError(null);
    
    // First, try to find existing room for this player
    const { data: existingRoom, error: findError } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq("player_id", playerId)
      .single();
    
    if (existingRoom) {
      setLoading(false);
      return existingRoom.id;
    }
    
    // If no room exists, create a new one
    const { data: newRoom, error: createError } = await supabase
      .from("chat_rooms")
      .insert([
        {
          player_id: playerId,
          type: 'direct'
        }
      ])
      .select("id")
      .single();
    
    if (createError) {
      setError(createError.message);
      setLoading(false);
      return null;
    }
    
    setLoading(false);
    return newRoom?.id || null;
  };

  // Fetch messages for a specific room
  const fetchMessages = async (roomId: string) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    
    if (error) {
      setError(error.message);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
    return data;
  };

  // Send a new message
  const sendMessage = async (roomId: string, senderId: string, body: string, senderType: string = 'player') => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          room_id: roomId,
          sender_id: senderId,
          body: body,
          sender_type: senderType
        }
      ])
      .select();
    
    if (error) {
      setError(error.message);
    } else {
      // Add the new message to local state
      if (data && data[0]) {
        setMessages(prev => [...prev, data[0]]);
      }
    }
    setLoading(false);
    return data;
  };

  return { messages, loading, error, fetchMessages, sendMessage, findOrCreateRoom };
} 