import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface AddPaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { paymentMethodId: string; tagId: string; tagName: string; qrCode?: string }) => Promise<void>;
  availablePaymentMethods: { id: string; payment_method: string }[];
  preSelectedMethod?: { id: string; payment_method: string } | null;
  isEditMode?: boolean;
  editData?: { tagId: string; tagName: string; qrCode?: string } | null;
}

export default function AddPaymentMethodModal({ 
  visible, 
  onClose, 
  onSave, 
  availablePaymentMethods,
  preSelectedMethod,
  isEditMode = false,
  editData = null
}: AddPaymentMethodModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [tagId, setTagId] = useState('');
  const [tagName, setTagName] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Set pre-selected method when modal opens
  React.useEffect(() => {
    if (preSelectedMethod) {
      setSelectedPaymentMethod(preSelectedMethod.id);
    }
  }, [preSelectedMethod]);

  // Set edit data when in edit mode
  React.useEffect(() => {
    if (isEditMode && editData) {
      setTagId(editData.tagId || '');
      setTagName(editData.tagName || '');
      setQrCode(editData.qrCode || '');
    }
  }, [isEditMode, editData]);

  const handleSave = async () => {
    if (!selectedPaymentMethod || !tagId.trim() || !tagName.trim()) {
      Alert.alert('Error', 'Please enter tag ID and tag name');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        paymentMethodId: selectedPaymentMethod,
        tagId: tagId.trim(),
        tagName: tagName.trim(),
        qrCode: qrCode.trim() || undefined
      });
      
      // Reset form
      setSelectedPaymentMethod('');
      setTagId('');
      setTagName('');
      setQrCode('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditMode ? 'Edit Payment Method' : 'Add New Payment Method'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {preSelectedMethod ? (
              <View>
                <Text style={styles.label}>Payment Method</Text>
                <View style={styles.selectedMethodContainer}>
                  <Text style={styles.selectedMethodText}>{preSelectedMethod.payment_method}</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.label}>Payment Method *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select payment method" value="" />
                    {availablePaymentMethods.map((method) => (
                      <Picker.Item 
                        key={method.id} 
                        label={method.payment_method} 
                        value={method.id} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            <Text style={styles.label}>Tag ID *</Text>
            <TextInput
              style={styles.input}
              value={tagId}
              onChangeText={setTagId}
              placeholder="e.g., user123, john_doe, etc."
              maxLength={50}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Tag Name *</Text>
            <TextInput
              style={styles.input}
              value={tagName}
              onChangeText={setTagName}
              placeholder="e.g., Personal, Business, etc."
              maxLength={50}
            />

            <Text style={styles.label}>QR Code URL (Optional)</Text>
            <TextInput
              style={styles.input}
              value={qrCode}
              onChangeText={setQrCode}
              placeholder="QR code image URL"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>{isEditMode ? 'Update' : 'Add'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#666',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  selectedMethodContainer: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#e7f3ff',
  },
  selectedMethodText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
}); 