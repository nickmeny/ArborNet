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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface SignupScreenProps {
  setIsAuthenticated?: (value: boolean) => void;
}

export default function SignupScreen({ setIsAuthenticated }: SignupScreenProps): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post(
        'http://172.31.171.181:5000/signup',
        { email, password, username },
        { withCredentials: true }
      );

      if (res.data.token) {
        await AsyncStorage.setItem('userToken', res.data.token);
      }

      Alert.alert("Success", "Account created successfully!");
      
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
            errorMessage = error.response.data?.error || `Error ${error.response.status}: Signup failed.`;
        } else if (error.request) {
            errorMessage = "No response from server. Check network connection or server status.";
        } else {
            errorMessage = "Error setting up signup request.";
        }
      } else {
        errorMessage = "An unexpected error occurred during signup.";
      }
      
      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLoginRedirect}
        disabled={isLoading}
      >
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, textAlign: "center", marginBottom: 30, fontWeight: "bold", color: "#333" },
  input: { height: 50, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  button: { backgroundColor: "#28a745", paddingVertical: 15, borderRadius: 8, marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "600", fontSize: 18 },
  loginButton: { paddingVertical: 15, marginTop: 10 },
  loginText: { textAlign: "center", color: "#007BFF", fontWeight: "600", fontSize: 16 }
});