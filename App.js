import React from 'react';
import { View, TouchableOpacity, Alert, Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from './styleshome';
import ScannerScreen from './ScannerScreen';
import SignupScreen from './Screens/SignupScreen';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <Text style={styles.title}>Camera Scanner App</Text>
      <Text style={styles.subtitle}>Tap the scanner icon to open camera</Text>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => Alert.alert('Home Pressed')}>
          <Image source={require('./assets/home.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
          <Image source={require('./assets/scanner.png')} style={[styles.icon, styles.scannerIcon]} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('History Pressed')}>
          <Image source={require('./assets/history.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signup"  // Signup screen will be first
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
