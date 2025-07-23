import { Game } from '@/hooks/useGames';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const handlePlayGame = () => {
    console.log('Play game:', game.game_name);
    // Add logic to open game URL
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePlayGame}>
      <View style={styles.content}>
        {game.game_logo_url && (
          <Image source={{ uri: game.game_logo_url }} style={styles.logo} />
        )}
        <Text style={styles.gameName}>{game.game_name || 'Unnamed Game'}</Text>
        <Text style={[styles.username, !game.game_username && styles.notFound]}>
          {game.game_username || 'User not found'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  notFound: {
    color: '#FF3B30',
    fontStyle: 'italic',
  },
}); 