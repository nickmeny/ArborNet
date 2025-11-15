import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import api from "../api/axiosConfig";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/get");
      setTasks(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
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
