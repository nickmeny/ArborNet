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

  // Recycling tasks for ACT AND WIN section
  const recyclingTasks: Task[] = [
    {
      id: "recycle-1",
      title: "Plastic Bottle Recycling",
      body: "Collect and recycle 10 plastic bottles from your neighborhood",
      location: "Local Recycling Center",
      timestamp: "All Day",
      tokens: 15
    },
    {
      id: "recycle-2",
      title: "E-Waste Collection",
      body: "Properly dispose of electronic waste at designated collection points",
      location: "Community E-Waste Center",
      timestamp: "9 AM - 5 PM",
      tokens: 25
    },
    {
      id: "recycle-3",
      title: "Community Cleanup",
      body: "Join local park cleanup and collect litter",
      location: "Central Park",
      timestamp: "10 AM - 12 PM",
      tokens: 30
    }
  ];

  return (
      <View style={styles.container}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Text style={styles.logoArbor}>Arbor</Text>
              <Text style={styles.logoNet}> Net</Text>
            </Text>
            <Text style={styles.tagline}>Eco Actions, Real Rewards</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Today's Tasks Section */}
          <Text style={styles.sectionHeader}>Today's Tasks</Text>
          {tasks.map(task => {
            const isLiked = likedTasks.has(task.id);
            
            return (
              <View key={task.id} style={styles.taskContainer}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskBody}>{task.body}</Text>
                  <View style={styles.taskDetails}>
                    <Text style={styles.taskInfo}>💰 {task.tokens} tokens</Text>
                    <Text style={styles.taskInfo}>📍 {task.location}</Text>
                    <Text style={styles.taskInfo}>🕐 {task.timestamp}</Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.socialButton,
                      styles.likeButton,
                      isLiked && styles.likedButton
                    ]}
                    onPress={() => handleLike(task.id)}
                  >
                    <Text style={[
                      styles.socialButtonText,
                      isLiked && styles.likedButtonText
                    ]}>
                      {isLiked ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.socialButton, styles.shareButton]}>
                    <Text style={styles.socialButtonText}>↗️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* ACT AND WIN Section */}
          <Text style={styles.mainHeader}>ACT AND WIN</Text>
          {recyclingTasks.map(task => {
            const isLiked = likedTasks.has(task.id);
            
            return (
              <View key={task.id} style={styles.taskContainer}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskBody}>{task.body}</Text>
                  <View style={styles.taskDetails}>
                    <Text style={styles.taskInfo}>💰 {task.tokens} tokens</Text>
                    <Text style={styles.taskInfo}>📍 {task.location}</Text>
                    <Text style={styles.taskInfo}>🕐 {task.timestamp}</Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.socialButton,
                      styles.likeButton,
                      isLiked && styles.likedButton
                    ]}
                    onPress={() => handleLike(task.id)}
                  >
                    <Text style={[
                      styles.socialButtonText,
                      isLiked && styles.likedButtonText
                    ]}>
                      {isLiked ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.socialButton, styles.shareButton]}>
                    <Text style={styles.socialButtonText}>↗️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e8', // Light pastel green background
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoArbor: {
    color: '#2E7D32', // Green color for Arbor
  },
  logoNet: {
    color: '#1976D2', // Blue color for Net
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 30,
    color: '#2E7D32',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    marginTop: 20,
    color: '#1a1a1a',
  },
  taskContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  taskBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  taskDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taskInfo: {
    fontSize: 12,
    color: '#888',
    marginRight: 12,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  likeButton: {
    backgroundColor: '#f8f9fa',
  },
  likedButton: {
    backgroundColor: '#ffebee',
  },
  shareButton: {
    backgroundColor: '#f8f9fa',
  },
  socialButtonText: {
    fontSize: 16,
  },
  likedButtonText: {
    color: '#e91e63',
  },
});