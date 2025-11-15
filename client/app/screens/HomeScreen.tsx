import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import api from "../api/axiosConfig";

interface Task {
  id: number | string; 
  title: string;
  body: string; // <-- This is what fixes the 'body' error!
  // Add any other properties (e.g., 'completed: boolean;')
}




export default function HomeScreen() {
const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await api.post("/login");
      setTasks(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    alert("Welcome to ArborNet!");
    fetchTasks();
  }, []);

  return (
    <ScrollView>
      {tasks.map(task => (
        <View key={task.id} style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 20 }}>{task.title}</Text>
          <Text>{task.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
