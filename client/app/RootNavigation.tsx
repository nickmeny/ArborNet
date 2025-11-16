import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './index';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { View, Text, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  // NO NavigationContainer - Expo Router provides it automatically
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen 
                {...props} 
                setIsAuthenticated={setIsAuthenticated} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Signup">
            {(props) => (
              <SignupScreen 
                {...props} 
                setIsAuthenticated={setIsAuthenticated} 
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Main" component={App} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;