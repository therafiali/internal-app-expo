import AddPaymentMethodModal from '@/components/AddPaymentMethodModal';
import { usePlayerContext } from '@/context/PlayerContext';
import { useGames } from '@/hooks/useGames';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { RedeemFlowData, useRedeemFlow } from '@/hooks/useRedeemFlow';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaymentMethodScreenProps {
  formData: RedeemFlowData;
  updateFormData: (field: keyof RedeemFlowData, value: any) => void;
  onNext: () => void;
}

export default function PaymentMethodScreen({ 
  formData, 
  updateFormData, 
  onNext
}: PaymentMethodScreenProps) {
  const { paymentMethods, loading, fetchPaymentMethods, addPaymentMethod, updatePaymentMethod } = usePaymentMethods();
  const { player } = usePlayerContext();
  const { submitRedeemRequest } = useRedeemFlow();
  const { games } = useGames();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMethodForAdd, setSelectedMethodForAdd] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (player?.id) {
      fetchPaymentMethods(player.id);
    }
  }, [player]);
  
  const handlePaymentMethodSelect = (method: any) => {
    if (method.is_configured) {
      // Select configured method for redeem
      updateFormData('paymentMethod', method.payment_method);
    } else {
      // Show add payment method modal with this method pre-selected
      setSelectedMethodForAdd(method);
      setIsEditMode(false);
      setEditData(null);
      setShowAddModal(true);
    }
  };

  const handleEditPaymentMethod = (method: any) => {
    // Show edit modal for configured methods
    setSelectedMethodForAdd(method);
    setEditData({
      tagId: method.player_tag_id || '',
      tagName: method.player_tag_name || '',
      qrCode: method.player_qr_code || ''
    });
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleAddPaymentMethod = async (data: { 
    paymentMethodId: string; 
    tagId: string;
    tagName: string; 
    qrCode?: string 
  }) => {
    if (!player?.id) return;
    
    if (isEditMode) {
      await updatePaymentMethod(
        player.id,
        data.paymentMethodId,
        data.tagId,
        data.tagName,
        data.qrCode
      );
    } else {
      await addPaymentMethod(
        player.id,
        data.paymentMethodId,
        data.tagId,
        data.tagName,
        data.qrCode
      );
    }
  };

  const handleSubmitRequest = async () => {
    if (!player?.id || !player?.team_id) return;
    
    // Find selected game to get game_id
    const selectedGame = games.find(game => game.game_name === formData.platform);
    
    console.log('🔍 Submit Request Data:', {
      playerId: player.id,
      teamId: player.team_id,
      platform: formData.platform,
      gameId: selectedGame?.id,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod
    });
    
    console.log('🎮 Selected Game:', selectedGame);
    
    if (!selectedGame) {
      Alert.alert('Error', 'Selected game not found');
      return;
    }
    
    console.log('📊 Final Submit Data:', {
      player_id: player.id,
      team_id: player.team_id,
      game_id: selectedGame.id,
      total_amount: parseFloat(formData.amount),
      process_status: '0'
    });
    
    setSubmitting(true);
    try {
      console.log( "player.id, player.team_id, selectedGame.id", player.id, player.team_id, selectedGame.id )
      const success = await submitRedeemRequest(player.id, player.team_id, selectedGame.id);
      console.log('✅ Submit Result:', success);
      
      if (success) {
        Alert.alert(
          'Success!',
          'Your redeem request has been submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form and go back to main screen
                updateFormData('platform', '');
                updateFormData('amount', '');
                updateFormData('paymentMethod', '');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to submit redeem request. Please try again.');
      }
    } catch (error) {
      console.error('❌ Submit Error:', error);
      Alert.alert('Error', 'Failed to submit redeem request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = formData.paymentMethod !== '';

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Payment Method</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      <Text style={styles.subtitle}>Choose at least one payment method</Text>
      
      {/* My Payment Methods Section */}
      {paymentMethods.filter(method => method.is_configured).length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Payment Methods</Text>
          <View style={styles.methodsGrid}>
            {paymentMethods.filter(method => method.is_configured).map((method) => (
              <View key={method.id} style={styles.methodContainer}>
                <TouchableOpacity
                  style={[
                    styles.methodOption,
                    formData.paymentMethod === method.payment_method && styles.selectedMethod
                  ]}
                  onPress={() => handlePaymentMethodSelect(method)}
                >
                  <View style={[
                    styles.methodIcon,
                    formData.paymentMethod === method.payment_method && styles.selectedIcon
                  ]}>
                    <Text style={[
                      styles.iconText,
                      formData.paymentMethod === method.payment_method && styles.selectedIconText
                    ]}>
                      {method.payment_method.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[
                    styles.methodText,
                    formData.paymentMethod === method.payment_method && styles.selectedText
                  ]}>
                    {method.payment_method}
                  </Text>
                  <Text style={[
                    styles.tagText,
                    formData.paymentMethod === method.payment_method && styles.selectedText
                  ]}>
                    {method.player_tag_name || method.player_tag_id}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPaymentMethod(method)}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Other Payment Methods Section */}
      {paymentMethods.filter(method => !method.is_configured).length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Other Payment Methods</Text>
          <View style={styles.methodsGrid}>
            {paymentMethods.filter(method => !method.is_configured).map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodOption,
                  styles.notConfiguredMethod
                ]}
                onPress={() => handlePaymentMethodSelect(method)}
              >
                <View style={styles.notConfiguredIcon}>
                  <Text style={styles.notConfiguredIconText}>
                    {method.payment_method.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.notConfiguredText}>
                  {method.payment_method}
                </Text>
                <Text style={styles.addNewText}>
                  + Add New
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {canProceed && (
          <TouchableOpacity 
            style={[styles.submitButton, submitting && styles.disabledButton]} 
            onPress={handleSubmitRequest}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <AddPaymentMethodModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPaymentMethod}
        availablePaymentMethods={paymentMethods.map(m => ({ 
          id: m.id, 
          payment_method: m.payment_method 
        }))}
        preSelectedMethod={selectedMethodForAdd}
        isEditMode={isEditMode}
        editData={editData}
      />
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
    marginBottom: 20,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodOption: {
    width: '48%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  selectedMethod: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  notConfiguredMethod: {
    borderColor: '#ffc107',
    borderStyle: 'dashed',
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedIcon: {
    backgroundColor: 'white',
  },
  notConfiguredIcon: {
    backgroundColor: '#fff3cd',
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  selectedIconText: {
    color: '#007bff',
  },
  notConfiguredIconText: {
    color: '#856404',
  },
  methodText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notConfiguredText: {
    color: '#856404',
  },
  addNewText: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  methodContainer: {
    width: '48%',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    zIndex: 1,
  },
  editIcon: {
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
}); 