import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
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
  const [likedTasks, setLikedTasks] = useState<Set<string | number>>(new Set());
  const fetchTasks = async () => {
    try {
      const res = await api.post(
        'http://172.31.171.181:5000/get',
        { tasks },
        { withCredentials: true }
      );
      setTasks(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    console.log()
    fetchTasks();
  }, []);
  const handleLike = (taskId: string | number) => {
    setLikedTasks(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(taskId)) {
        newLiked.delete(taskId);
      } else {
        newLiked.add(taskId);
      }
      return newLiked;
    });
  };
  return (
      <>
      <Text style={styles.header}>Today's Tasks</Text>
      <ScrollView>
        {tasks.map(task => {
          const isLiked = likedTasks.has(task.id);
          return (
            <View key={task.id} style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskBody}>{task.body}</Text>
              <Text style={styles.taskInfo}>💰 {task.tokens} tokens</Text>
              <Text style={styles.taskInfo}>📍 {task.location}</Text>
              
              <TouchableOpacity 
                style={[styles.likeButton, isLiked && styles.likedButton]}
                onPress={() => handleLike(task.id)}
              >
                <Text style={styles.likeText}>
                  {isLiked ? '⭐ Liked':'★ Like'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  taskContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  likeButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  likedButton: {
    backgroundColor: '#ffe6e6',
  },
  likeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});