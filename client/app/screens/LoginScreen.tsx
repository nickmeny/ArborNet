import React, { JSX, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../api/axiosConfig";
import axios, { AxiosError } from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  setIsAuthenticated?: (value: boolean) => void;
}

export default function LoginScreen({ setIsAuthenticated }: LoginScreenProps): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const res = await api.post(
        'http://172.29.84.3:5000/login',
        { email, password },
        { withCredentials: true }
      );

      Alert.alert("Success", `Logged in as ${res.data.email}`);
      
      if (res.data.token) {
        await AsyncStorage.setItem('userToken', res.data.tokens);
      }
      
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      } else {
        navigation.navigate("Main");
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      let errorMessage = axiosError.response?.data?.error;

      if (axios.isAxiosError(error)) {
        if (error.response) {
            errorMessage = error.response.data?.error || `Error ${error.response.status}: Login failed.`;
        } else if (error.request) {
            errorMessage = "No response from server. Check network connection or server status.";
        } else {
            errorMessage = "Error setting up login request.";
        }
      } else {
        errorMessage = "An unexpected error occurred during login.";
      }
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigation.navigate("Signup");
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
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signupButton}
        onPress={handleSignupRedirect}
        disabled={isLoading}
      >
        <Text style={styles.signupText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, textAlign: "center", marginBottom: 30, fontWeight: "bold", color: "#333" },
  input: { height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: "#007BFF", paddingVertical: 15, borderRadius: 8, marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "600", fontSize: 18 },
  signupButton: { paddingVertical: 15, marginTop: 10 },
  signupText: { textAlign: "center", color: "#007BFF", fontWeight: "600", fontSize: 16 }
});