import React, {useState} from 'react';
import {apiService} from '../../services/ApiService.js'
import { StyleSheet, Text, View, TextInput, Linking } from 'react-native';

export default function HomeScreen() {
  const [input, setInput] = useState('input link here')
  const [links, setLinks] = useState([['empty', 'https://link.com'], ['empty2', 'google.com']])
  const getLinks = async (url) => {
    setLinks(await apiService.getLinks(url))
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.h1}>Music Connect!</Text>
      <TextInput
        style={styles.input}
        onChange={event => {
          event.persist()
          setInput(event.target.value)
        }}
        value={input}
        onSubmitEditing={event => getLinks(event.nativeEvent.text)}
      />
      </View>
      <View style={styles.links}>
        {links.map(link => {
          return <Text style={styles.link} onPress={() => Linking.openURL(link[1])} key={link}> {link[0]} </Text> 
        } ) }
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1 : {
    fontSize: 50,
  }, 
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  link: {
    fontSize: 20,
    color: 'blue',
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
    margin: 5,
    alignSelf: 'center'
  },
  links: {
    flex: 2,
  }
});