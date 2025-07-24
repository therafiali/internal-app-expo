import { useState } from "react";
import { supabase } from "../lib/supabase";

export interface PaymentMethod {
  id: string;
  payment_method: string;
  player_tag_id?: string;
  player_tag_name?: string;
  player_qr_code?: string;
  is_configured: boolean;
}

export function usePaymentMethods() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const fetchPaymentMethods = async (playerId?: string) => {
    setLoading(true);
    setError(null);
    
    console.log('🔍 Fetching payment methods for playerId:', playerId);
    
    const { data, error } = await supabase
      .from("payment_methods")
      .select(`
        id, 
        payment_method,
        player_payment_methods!left(
          tag_id,
          tag_name,
          qr_code,
          player_id
        )
      `);
    
    console.log('📊 Raw data from database:', data);
    console.log('❌ Error if any:', error);
    
    if (error) {
      setError(error.message);
    } else {
      const formattedData = data?.map(method => {
        // Find payment method for this specific player
        const playerMethod = method.player_payment_methods?.find(
          (pm: any) => pm.player_id === playerId
        );
        
        console.log(`🔍 Method ${method.payment_method}:`, {
          allPlayerMethods: method.player_payment_methods,
          foundPlayerMethod: playerMethod,
          playerId: playerId
        });
        
        return {
          id: method.id,
          payment_method: method.payment_method,
          player_tag_id: playerMethod?.tag_id || undefined,
          player_tag_name: playerMethod?.tag_name || undefined,
          player_qr_code: playerMethod?.qr_code || undefined,
          is_configured: !!playerMethod?.tag_name
        };
      }) || [];
      
      console.log('✅ Final formatted data:', formattedData);
      setPaymentMethods(formattedData);
    }
    
    setLoading(false);
    return data;
  };

  const addPaymentMethod = async (
    playerId: string, 
    paymentMethodId: string, 
    tagId: string,
    tagName: string, 
    qrCode?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from("player_payment_methods")
        .insert({
          player_id: playerId,
          payment_method: paymentMethodId,
          tag_id: tagId,
          tag_name: tagName,
          qr_code: qrCode || null
        });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      // Refresh the payment methods list
      await fetchPaymentMethods(playerId);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add payment method');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (
    playerId: string,
    paymentMethodId: string,
    tagId: string,
    tagName: string,
    qrCode?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from("player_payment_methods")
        .update({
          tag_id: tagId,
          tag_name: tagName,
          qr_code: qrCode || null
        })
        .eq('player_id', playerId)
        .eq('payment_method', paymentMethodId);
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      // Refresh the payment methods list
      await fetchPaymentMethods(playerId);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update payment method');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { paymentMethods, loading, error, fetchPaymentMethods, addPaymentMethod, updatePaymentMethod };
} 