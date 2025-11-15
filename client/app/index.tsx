import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
// Removed: import Ionicons from 'react-native-vector-icons/Ionicons'; 
// NOTE: NavigationContainer was removed from this file as it is assumed to be provided by the root app.
// --- 1. Type Definitions ---

import AppNavigator from "./Navigation/AppNavigator";



// Define the parameter list for our tab navigator screens
// 'undefined' means the screen takes no parameters (props) when navigating
type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Prices: undefined;
};

// Get the type for the Tab Navigator itself
const Tab = createBottomTabNavigator<RootTabParamList>();

// --- 2. Screen Components ---

const HomeScreen: React.FC = () => {
  return (
    <><View style={[styles.container, { backgroundColor: '#f0f4f8' }]}>
      <Text style={styles.title}>ArborNet</Text>
      <Text style={styles.subtitle}>Your main dashboard is here.</Text>
    </View><AppNavigator /></>
  );
};

const ProfileScreen: React.FC = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#e8f5e9' }]}>
      <Text style={styles.title}>Your Profile 👤</Text>
      <Text style={styles.subtitle}>Edit your personal settings and details.</Text>
    </View>
  );
};

const PricesScreen: React.FC = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#fbe9e7' }]}>
      <Text style={styles.title}>Market Prices 📈</Text>
      <Text style={styles.subtitle}>Check the latest figures and rates.</Text>
    </View>
  );
};

// --- 3. Main App Component (Navigator Setup) ---

const App = () => {
  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          // Removed: tabBarIcon function. The text label will now display prominently.
          headerShown: false,
          // Styling for the tab bar
          tabBarActiveTintColor: '#0D47A1', // Deep Blue
          tabBarInactiveTintColor: '#757575', // Gray
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabBar,
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerShadowVisible: false, // Optional: removes the shadow line under the header
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Dashboard' }} // This text will now be the main tab content
        />
        <Tab.Screen
          name="Prices"
          component={PricesScreen}
          options={{ title: 'Rates' }} // This text will now be the main tab content
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Account' }} // This text will now be the main tab content
        />
      </Tab.Navigator>
  );
};

// --- 4. Stylesheet ---

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
  },
  // Tab Bar Styles
  tabBar: {
    backgroundColor: '#ffffff',
    height: height * 0.1, // Responsive height
    borderTopWidth: 0,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    // Increased padding when no icons are present to vertically center text
    paddingBottom: 15, 
    paddingTop: 15,
  },
  tabBarLabel: {
    fontSize: 16, // Increased font size for better visibility without icons
    fontWeight: '700', // Made text bolder
    lineHeight: 20,
  },
  headerStyle: {
    backgroundColor: '#ffffff',
    height: 90,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#212121',
  },
});

export default App; // Ensure the main component is exported
