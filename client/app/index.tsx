import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';



// Define tab types HERE
type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Prices: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TasksScreen: React.FC = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#fbe9e7' }]}>
      <Text style={styles.title}>Post A New Task 📈</Text>
    </View>
  );
};


const App = () => {
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
      <Tab.Screen name="TasksScreen" component={TasksScreen} options = {{title: 'Adding Tasks'}} />
    </Tab.Navigator>
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
});

export default App;