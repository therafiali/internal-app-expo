import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function RechargeButton() {
  const handleRecharge = () => {
    console.log('Recharge pressed');
    // Add recharge logic here
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleRecharge}>
      <Text style={styles.buttonText}>Recharge</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 