import React, { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, Text, Alert } from 'react-native';
import Pdf from 'react-native-pdf';
import ScreenCaptureSecure from 'react-native-screen-capture-secure';
import KeepAwake from 'react-native-keep-awake';
import { PdfScreenProps } from '../types';

const PdfScreen: React.FC<PdfScreenProps> = ({ navigation }) => {
  const [seconds, setSeconds] = useState(10); // 5-minute time limit (300 seconds)

  useEffect(() => {
    // Activate screenshot prevention
    ScreenCaptureSecure.activate();

    // Keep the screen awake
    KeepAwake.activate();

    // Prevent back navigation
    const backAction = () => true;  // Disable back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Timer to deactivate restrictions after 5 minutes
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      backHandler.remove();
      ScreenCaptureSecure.deactivate();
      KeepAwake.deactivate();
    };
  }, []);

  // End session: Remove restrictions and redirect
  const endSession = () => {
    ScreenCaptureSecure.deactivate();
    KeepAwake.deactivate();
    Alert.alert("Time's up", "You are being redirected to the home screen.");
    navigation.navigate('Home');
  };

  const source = { uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', cache: true };

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time Remaining: {formatTime(seconds)}</Text>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages: number) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={(error: any) => {
          console.log(error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timer: {
    fontSize: 20,
    color: '#d9534f',
    marginVertical: 10,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default PdfScreen;
