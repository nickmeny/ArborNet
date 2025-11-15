import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackgroundBase } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './type';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Arbor Net!</Text>
      <Button
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Text>TODAYS EVENTS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
  ImageBackgroundBase: {}
});
