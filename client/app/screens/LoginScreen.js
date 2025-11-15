import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../api/axiosConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      Alert.alert("Success", "Logged in!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.error || "Unknown error");
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
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 32, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  input: {
    height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    paddingHorizontal: 10, marginBottom: 15
  },
  button: { backgroundColor: "#4CAF50", paddingVertical: 15, borderRadius: 8 },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "bold", fontSize: 18 }
});
