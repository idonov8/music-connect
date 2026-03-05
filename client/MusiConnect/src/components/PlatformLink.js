import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getPlatformInfo } from '../utils/platforms';

export default function PlatformLink({ platformKey, url, isDefault, onSetDefault }) {
  const { name, color, icon } = getPlatformInfo(platformKey);

  const handlePress = () => {
    Linking.openURL(url).catch((err) => {
      console.warn('Failed to open URL:', err);
    });
  };

  const handleLongPress = () => {
    if (onSetDefault) {
      onSetDefault(platformKey);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: color }, isDefault && styles.defaultContainer]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <Feather name={icon} size={20} color={color} style={styles.icon} />
      <Text style={[styles.text, { color }]}>{name}</Text>
      {isDefault && (
        <Text style={styles.defaultBadge}>DEFAULT</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: '#fff',
  },
  defaultContainer: {
    borderWidth: 3,
    backgroundColor: '#f0fff4',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  defaultBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1DB954',
    backgroundColor: '#e6f9ee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
