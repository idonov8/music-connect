import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [num, setNum] = useState(1)
  const func = () => {
    console.log("PRESSED BUTTON")
    setNum(num+1)
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.h1}>Music Connect!</Text>
      <Text>Number: {num}</Text>
      <Button title="Increment" onPress={func}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1 : {
    fontSize: 50
  }
});