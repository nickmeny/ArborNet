import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import VerificationScreen from './screens/VerificationScreen';

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
    <View style={[styles.container, { backgroundColor: '#fbe9e7' }]}>
      <Text style={styles.title}>Post A New Task 📈</Text>
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
        tabBarActiveTintColor: '#0D47A1',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Account' }} />
      <Tab.Screen name="TasksScreen" component={TasksScreen} options={{ title: 'Adding Tasks' }} />
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
  tabBar: {
    backgroundColor: '#ffffff',
    height: Dimensions.get('window').height * 0.1,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },
  tabBarLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  tabBarStyle: {
    backgroundColor: '#2C3E50',
    height: Dimensions.get('window').height * 0.1,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    paddingBottom: 15,
    paddingTop: 15,
  },
});
export default App;