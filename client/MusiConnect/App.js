import React from 'react';
import { useShareIntent } from 'expo-share-intent';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const { shareIntent } = useShareIntent();

  // Extract the shared URL text
  const sharedUrl = shareIntent?.text || null;

  return <HomeScreen sharedUrl={sharedUrl} />;
}
