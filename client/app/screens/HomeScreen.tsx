import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import api from "../api/axiosConfig";

interface Task {
  id: number | string; 
  title: string;
  body: string; 
  location: string;
  timestamp: string;
  tokens: number;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await api.post(
        'http://172.29.84.3:5000/get',
        { tasks },
        { withCredentials: true }
      );
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