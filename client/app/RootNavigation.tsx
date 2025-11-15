import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './index'; // <-- Imports your bottom tab bar component

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (

      <Stack.Navigator 
        // THIS IS THE FIX for the 'INDEX' header: Hides the header for all screens in the stack
        screenOptions={{ 
          headerShown: false 
        }}
      >
        <Stack.Screen
          name="Index" // This screen name is what creates the "INDEX" title if headerShown is true.
          component={App}
        />
      </Stack.Navigator>

  );
};

export default RootNavigator;