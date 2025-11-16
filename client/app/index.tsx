import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import VerificationScreen from './screens/VerificationScreen';
import PricesScreen from './screens/ProfileScreen'; // Make sure to import PricesScreen

// Define tab types
type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Prices: undefined;
  TasksScreen: undefined;
};

// Define stack types
type RootStackParamList = {
  MainTabs: undefined;
  VerificationScreen: { task: any; onTaskComplete: (taskId: string | number) => void };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TasksScreen: React.FC = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#1E2B4E' }]}>
      <Text style={styles.title}>Post A New Task 📈</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
    </View>
  );
};

// Create tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3498DB', // Bright blue for active
        tabBarInactiveTintColor: '#BDC3C7', // Light gray for inactive
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Prices" component={PricesScreen} options={{ title: 'Rewards' }} />
      <Tab.Screen name="TasksScreen" component={TasksScreen} options={{ title: 'Add Tasks' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
};

// Create main app with stack navigator
const App = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#2C3E50', // Dark header background
    height: Dimensions.get('window').height * 0.1,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3, // Darker shadow for more depth
    shadowRadius: 10,
    paddingBottom: 15,
    paddingTop: 15,
    borderTopColor: '#34495E', // Subtle border
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});

export default App;