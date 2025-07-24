import { RedeemFlowData } from '@/hooks/useRedeemFlow';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AmountInputScreenProps {
  formData: RedeemFlowData;
  updateFormData: (field: keyof RedeemFlowData, value: any) => void;
  onNext: () => void;
}

export default function AmountInputScreen({ 
  formData, 
  updateFormData, 
  onNext
}: AmountInputScreenProps) {
  
  const handleAmountChange = (amount: string) => {
    // Only allow numbers and decimal point
    const numericValue = amount.replace(/[^0-9.]/g, '');
    updateFormData('amount', numericValue);
  };

  const canProceed = formData.amount !== '' && parseFloat(formData.amount) > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Amount</Text>
      
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          value={formData.amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.note}>
        Minimum amount: $10.00
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.nextButton, !canProceed && styles.disabledButton]} 
          onPress={onNext}
          disabled={!canProceed}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    paddingVertical: 15,
  },
  note: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 