import { usePlayerContext } from '@/context/PlayerContext';
import { useGames } from '@/hooks/useGames';
import { RedeemFlowData } from '@/hooks/useRedeemFlow';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PlatformSelectScreenProps {
  formData: RedeemFlowData;
  updateFormData: (field: keyof RedeemFlowData, value: any) => void;
  onNext: () => void;
}

export default function PlatformSelectScreen({ 
  formData, 
  updateFormData, 
  onNext
}: PlatformSelectScreenProps) {
  const { games, loading, fetchGames } = useGames();
  const { player } = usePlayerContext();

  useEffect(() => {
    if (player?.id) {
      fetchGames(player.id);
    }
  }, [player]);
  
  const handlePlatformSelect = (gameId: string, gameName: string) => {
    updateFormData('platform', gameName);
  };

  const canProceed = formData.platform !== '';

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Game</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Game</Text>
      
      <View style={styles.platformGrid}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[
              styles.platformOption,
              formData.platform === game.game_name && styles.selectedPlatform,
              !game.game_username && styles.notConfiguredPlatform
            ]}
            onPress={() => handlePlatformSelect(game.id, game.game_name || '')}
          >
            <Text style={[
              styles.platformText,
              formData.platform === game.game_name && styles.selectedText,
              !game.game_username && styles.notConfiguredText
            ]}>
              {game.game_name}
            </Text>
            <Text style={[
              styles.usernameText,
              formData.platform === game.game_name && styles.selectedText,
              !game.game_username && styles.notConfiguredText
            ]}>
              {game.game_username ? `(${game.game_username})` : '(Not configured)'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  platformOption: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedPlatform: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  platformText: {
    fontSize: 16,
    fontWeight: '600',
  },
  usernameText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
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
  notConfiguredPlatform: {
    borderColor: '#ffc107',
    borderStyle: 'dashed',
  },
  notConfiguredText: {
    color: '#856404',
  },
}); 