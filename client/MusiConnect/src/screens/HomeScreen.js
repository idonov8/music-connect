import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { getLinks } from '../services/apiService';
import { getPlatformInfo } from '../utils/platforms';
import PlatformLink from '../components/PlatformLink';
import DefaultServicePicker from '../components/DefaultServicePicker';

const STORAGE_KEY = '@music_connect_default_service';

export default function HomeScreen({ sharedUrl }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defaultService, setDefaultService] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [autoOpened, setAutoOpened] = useState(null);
  const processedShareRef = useRef(null);

  // Load default service on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) setDefaultService(value);
    });
  }, []);

  // Handle shared URL from other apps
  useEffect(() => {
    if (sharedUrl && sharedUrl !== processedShareRef.current) {
      processedShareRef.current = sharedUrl;
      setInput(sharedUrl);
      handleSearch(sharedUrl);
    }
  }, [sharedUrl]);

  const handleSearch = useCallback(
    async (url) => {
      const trimmed = (url || input).trim();
      if (!trimmed) return;

      setLoading(true);
      setError(null);
      setResult(null);
      setAutoOpened(null);

      try {
        const data = await getLinks(trimmed);
        setResult(data);

        // Auto-open in default service if available
        if (defaultService && data.platforms[defaultService]) {
          const targetUrl = data.platforms[defaultService].url;
          const { name } = getPlatformInfo(defaultService);
          try {
            await Linking.openURL(targetUrl);
            setAutoOpened(name);
          } catch {
            // Failed to open, just show the list
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [input, defaultService],
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setInput(text);
        handleSearch(text);
      }
    } catch {
      setError('Could not read clipboard');
    }
  }, [handleSearch]);

  const handleSetDefault = useCallback(async (platformKey) => {
    if (platformKey) {
      await AsyncStorage.setItem(STORAGE_KEY, platformKey);
      setDefaultService(platformKey);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setDefaultService(null);
    }
    setPickerVisible(false);
  }, []);

  const platformEntries = result?.platforms
    ? Object.entries(result.platforms)
    : [];

  // Sort: default service first, then alphabetical
  if (defaultService) {
    platformEntries.sort(([a], [b]) => {
      if (a === defaultService) return -1;
      if (b === defaultService) return 1;
      return a.localeCompare(b);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Music Connect</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setPickerVisible(true)}
            >
              <Feather name="settings" size={22} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Share a link from any music app, or paste one below
          </Text>
          {defaultService && (
            <View style={styles.defaultIndicator}>
              <Feather name="check-circle" size={14} color="#1DB954" />
              <Text style={styles.defaultIndicatorText}>
                Default: {getPlatformInfo(defaultService).name}
              </Text>
            </View>
          )}
        </View>

        {/* Input Area */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Paste a Spotify, Apple Music, YouTube link..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Feather name="clipboard" size={18} color="#495057" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={() => handleSearch()}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Find Links'}
          </Text>
        </TouchableOpacity>

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#1DB954"
            style={styles.loader}
          />
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Auto-opened banner */}
        {autoOpened && (
          <View style={styles.autoOpenBanner}>
            <Feather name="external-link" size={16} color="#1DB954" />
            <Text style={styles.autoOpenText}>
              Opened in {autoOpened}
            </Text>
          </View>
        )}

        {/* Song Metadata */}
        {result && (
          <View style={styles.metadataContainer}>
            {result.thumbnailUrl && (
              <Image
                source={{ uri: result.thumbnailUrl }}
                style={styles.thumbnail}
              />
            )}
            <View style={styles.metadataText}>
              {result.title && (
                <Text style={styles.songTitle} numberOfLines={1}>
                  {result.title}
                </Text>
              )}
              {result.artistName && (
                <Text style={styles.artistName} numberOfLines={1}>
                  {result.artistName}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Results List */}
        <FlatList
          data={platformEntries}
          keyExtractor={([platform]) => platform}
          renderItem={({ item: [platform, data] }) => (
            <PlatformLink
              platformKey={platform}
              url={data.url}
              isDefault={platform === defaultService}
              onSetDefault={handleSetDefault}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading && !error && !result ? (
              <View style={styles.emptyContainer}>
                <Feather name="share" size={48} color="#ddd" />
                <Text style={styles.emptyTitle}>Share a link to get started</Text>
                <Text style={styles.emptyText}>
                  Open Spotify, YouTube, or any music app and share a song link to Music Connect
                </Text>
                {!defaultService && (
                  <TouchableOpacity
                    style={styles.setDefaultPrompt}
                    onPress={() => setPickerVisible(true)}
                  >
                    <Text style={styles.setDefaultPromptText}>
                      Set your default music app
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null
          }
        />

        {/* Default Service Picker */}
        <DefaultServicePicker
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={handleSetDefault}
          currentDefault={defaultService}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  inner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  settingsButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  defaultIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  defaultIndicatorText: {
    fontSize: 13,
    color: '#1DB954',
    fontWeight: '500',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  pasteButton: {
    marginLeft: 8,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 10,
  },
  searchButton: {
    marginHorizontal: 16,
    marginTop: 10,
    height: 48,
    backgroundColor: '#1DB954',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    textAlign: 'center',
  },
  autoOpenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e6f9ee',
    borderRadius: 8,
  },
  autoOpenText: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  metadataText: {
    marginLeft: 12,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  setDefaultPrompt: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1DB954',
    borderRadius: 8,
  },
  setDefaultPromptText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
