import AmountInputScreen from '@/components/redeem-flow/AmountInputScreen';
import PaymentMethodScreen from '@/components/redeem-flow/PaymentMethodScreen';
import PlatformSelectScreen from '@/components/redeem-flow/PlatformSelectScreen';
import { useRedeemFlow } from '@/hooks/useRedeemFlow';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export default function RedeemFlowScreen() {
  const router = useRouter();
  const { 
    currentStep, 
    formData, 
    updateFormData, 
    nextStep, 
    prevStep, 
    resetFlow 
  } = useRedeemFlow();

  const handleNext = () => {
    if (currentStep < 2) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Success!', 
      'Your redeem request has been submitted successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            resetFlow();
            router.push('/(tabs)');
          }
        }
      ]
    );
  };

  const renderCurrentScreen = () => {
    const commonProps = {
      formData,
      updateFormData,
      onNext: handleNext,
    };

    switch (currentStep) {
      case 0:
        return <PlatformSelectScreen {...commonProps} />;
      case 1:
        return <AmountInputScreen {...commonProps} />;
      case 2:
        return <PaymentMethodScreen {...commonProps} />;
      default:
        return <PlatformSelectScreen {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
}); 