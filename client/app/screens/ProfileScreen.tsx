import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define the tab param list for this screen
type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Prices: undefined;
};

type ProfileScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Profile Screen!</Text>
      <Button
        title="Go back Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});