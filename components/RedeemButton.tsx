import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function RedeemButton() {
  const handleRedeem = () => {
    console.log('Redeem pressed');
    // Add redeem logic here
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleRedeem}>
      <Text style={styles.buttonText}>Redeem</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34C759',
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