import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface RedeemFlowData {
  platform: string;
  amount: string;
  paymentMethod: string;
  screenshot: string | null;
}

export function useRedeemFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RedeemFlowData>({
    platform: '',
    amount: '',
    paymentMethod: '',
    screenshot: null,
  });

  const updateFormData = (field: keyof RedeemFlowData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetFlow = () => {
    setCurrentStep(0);
    setFormData({
      platform: '',
      amount: '',
      paymentMethod: '',
      screenshot: null,
    });
  };

  const submitRedeemRequest = async (playerId: string, teamId: string, gameId: string) => {
    try {
      console.log( "playerId, teamId, gameId", playerId, teamId, gameId )
      const { error } = await supabase
        .from('redeem_requests')
        .insert({
          player_id: playerId,
          team_id: teamId,
          game_id: gameId,
          total_amount: parseFloat(formData.amount),
          process_status: '0',
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error submitting redeem request:', error);
      return false;
    }
  };
  

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    resetFlow,
    submitRedeemRequest,
    totalSteps: 3
  };
} 