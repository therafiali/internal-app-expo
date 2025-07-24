import { RedeemFlowData } from '@/hooks/useRedeemFlow';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenshotUploadScreenProps {
  formData: RedeemFlowData;
  updateFormData: (field: keyof RedeemFlowData, value: any) => void;
  onSubmit: () => void;
}

export default function ScreenshotUploadScreen({ 
  formData, 
  updateFormData, 
  onSubmit
}: ScreenshotUploadScreenProps) {
  
  const handleImageUpload = () => {
    // Mock image upload for now
    Alert.alert('Image Upload', 'Image upload functionality will be implemented');
    updateFormData('screenshot', 'mock-screenshot-url');
  };

  const canSubmit = formData.screenshot !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Screenshot</Text>
      <Text style={styles.subtitle}>Upload proof of your request</Text>
      
      <TouchableOpacity style={styles.uploadArea} onPress={handleImageUpload}>
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>Click to upload</Text>
        <Text style={styles.uploadSubtext}>Max 5 images</Text>
      </TouchableOpacity>

      {formData.screenshot && (
        <View style={styles.uploadedContainer}>
          <Text style={styles.uploadedText}>✅ Screenshot uploaded successfully</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, !canSubmit && styles.disabledButton]} 
          onPress={onSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.buttonText}>Submit Redeem Request</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6c757d',
  },
  uploadedContainer: {
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadedText: {
    color: '#28a745',
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
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