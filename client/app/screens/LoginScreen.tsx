import React, { JSX, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../api/axiosConfig";
import axios, { AxiosError } from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the root stack param list if you are using TypeScript for better type safety
// You should replace 'any' with the actual type definition of your stack
type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined; // Make sure this name matches your stack navigator definition
  // ... other screens
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

export default function LoginScreen(): JSX.Element {
  // Specify the expected navigation prop type
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      // NOTE: Make sure 'api' is correctly configured or use the full URL as shown
      const res = await api.post(
        'http://172.31.171.181:5000/login',
        { email, password },
        { withCredentials: true }
      );

      Alert.alert("Success", `Logged in as ${res.data.email}`);
      
      // *** FIX APPLIED HERE ***
      // Navigate to the screen named "HomeScreen"
      navigation.navigate("HomeScreen"); 
      
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      let errorMessage = axiosError.response?.data?.error;

      // Handle common Axios errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with an error (e.g., 400, 401, 500)
            errorMessage = error.response.data?.error || `Error ${error.response.status}: Login failed.`;
        } else if (error.request) {
            // Request was made but no response received (e.g., network error)
            errorMessage = "No response from server. Check network connection or server status.";
        } else {
            // Something else happened while setting up the request
            errorMessage = "Error setting up login request.";
        }
      } else {
        errorMessage = "An unexpected error occurred during login.";
      }
      
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="default"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, textAlign: "center", marginBottom: 30, fontWeight: "bold", color: "#333" },
  input: { height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: "#007BFF", paddingVertical: 15, borderRadius: 8, marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "600", fontSize: 18 }
});