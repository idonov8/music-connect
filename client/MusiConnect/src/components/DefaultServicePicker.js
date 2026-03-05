import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PLATFORM_INFO, getPlatformInfo } from '../utils/platforms';

export default function DefaultServicePicker({ visible, onClose, onSelect, currentDefault }) {
  const platforms = Object.keys(PLATFORM_INFO);

  const renderItem = ({ item: platformKey }) => {
    const { name, color, icon } = getPlatformInfo(platformKey);
    const isSelected = platformKey === currentDefault;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => onSelect(platformKey)}
      >
        <Feather name={icon} size={20} color={color} style={styles.icon} />
        <Text style={[styles.itemText, { color }]}>{name}</Text>
        {isSelected && <Feather name="check" size={20} color="#1DB954" />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Default Music App</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Links will auto-open in your default app.{'\n'}
            Long-press any result to change it.
          </Text>

          <FlatList
            data={platforms}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            style={styles.list}
          />

          {currentDefault && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onSelect(null)}
            >
              <Text style={styles.clearButtonText}>Clear Default</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: '#f0fff4',
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  clearButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#c00',
    fontWeight: '600',
  },
});
