import React, { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import Header from './components/Header';
import GenerateQrScreen from './screens/GenerateQrScreen';

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
        <Header title="QRCode Generator" />
        <GenerateQrScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:{
    flex: 1
  }
});
