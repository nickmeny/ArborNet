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
  const [completedTasks, setCompletedTasks] = useState<Set<string | number>>(new Set());
  const [userTokens, setUserTokens] = useState<number>(156); // Random starting tokens
  
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

  const handleComplete = (taskId: string | number) => {
    // Only allow completion for ACT AND WIN tasks that aren't already completed
    if (taskId.toString().startsWith('recycle-') && !completedTasks.has(taskId)) {
      setCompletedTasks(prev => {
        const newCompleted = new Set(prev);
        newCompleted.add(taskId);
        return newCompleted;
      });
      
      // Add tokens when completing ACT AND WIN tasks
      const task = recyclingTasks.find(t => t.id === taskId);
      if (task) {
        setUserTokens(prev => prev + task.tokens);
      }
    }
  };

  // More tasks for Today's Tasks section
  const additionalTasks: Task[] = [
    {
      id: "daily-1",
      title: "Morning Coffee Run",
      body: "Pick up coffee for the team meeting",
      location: "Downtown Cafe",
      timestamp: "9:00 AM",
      tokens: 5
    },
    {
      id: "daily-2",
      title: "Document Review",
      body: "Review and provide feedback on quarterly report",
      location: "Office",
      timestamp: "10:30 AM",
      tokens: 15
    },
    {
      id: "daily-3",
      title: "Client Meeting",
      body: "Weekly sync with client stakeholders",
      location: "Conference Room B",
      timestamp: "2:00 PM",
      tokens: 25
    },
    {
      id: "daily-4",
      title: "Team Lunch",
      body: "Organize team lunch for department",
      location: "Main Restaurant",
      timestamp: "12:30 PM",
      tokens: 10
    },
    {
      id: "daily-5",
      title: "Code Review",
      body: "Complete code review for new feature branch",
      location: "Remote",
      timestamp: "4:00 PM",
      tokens: 20
    },
    {
      id: "daily-6",
      title: "Gym Session",
      body: "Complete your daily workout routine",
      location: "Fitness Center",
      timestamp: "6:00 PM",
      tokens: 8
    }
  ];

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
    },
    {
      id: "recycle-4",
      title: "Paper Recycling Drive",
      body: "Collect and recycle paper waste from offices",
      location: "Business District",
      timestamp: "All Day",
      tokens: 20
    }
  ];

  const allTasks = [...tasks, ...additionalTasks];

  return (
      <View style={styles.container}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.userInfo}>
              <Text style={styles.profileIcon}>👤</Text>
              <Text style={styles.username}>Alex Johnson</Text>
            </View>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenIcon}>🪙</Text>
              <Text style={styles.tokenCount}>{userTokens}</Text>
            </View>
          </View>
          
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
          {allTasks.map(task => {
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
            const isCompleted = completedTasks.has(task.id);
            
            return (
              <View key={task.id} style={[
                styles.taskContainer,
                isCompleted && styles.completedTask
              ]}>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle,
                    isCompleted && styles.completedText
                  ]}>{task.title}</Text>
                  <Text style={[
                    styles.taskBody,
                    isCompleted && styles.completedText
                  ]}>{task.body}</Text>
                  <View style={styles.taskDetails}>
                    <Text style={[
                      styles.taskInfo,
                      isCompleted && styles.completedText
                    ]}>💰 {task.tokens} tokens</Text>
                    <Text style={[
                      styles.taskInfo,
                      isCompleted && styles.completedText
                    ]}>📍 {task.location}</Text>
                    <Text style={[
                      styles.taskInfo,
                      isCompleted && styles.completedText
                    ]}>🕐 {task.timestamp}</Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.socialButton,
                      styles.likeButton,
                      isLiked && styles.likedButton,
                      isCompleted && styles.disabledButton
                    ]}
                    onPress={() => !isCompleted && handleLike(task.id)}
                    disabled={isCompleted}
                  >
                    <Text style={[
                      styles.socialButtonText,
                      isLiked && styles.likedButtonText,
                      isCompleted && styles.disabledText
                    ]}>
                      {isLiked ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.completeButton,
                      isCompleted && styles.completedTaskButton
                    ]}
                    onPress={() => handleComplete(task.id)}
                    disabled={isCompleted}
                  >
                    <Text style={[
                      styles.completeButtonText,
                      isCompleted && styles.completedButtonText
                    ]}>
                      {isCompleted ? '✅ Done' : 'Mark Done'}
                    </Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tokenIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  tokenCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
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
  completedTask: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
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
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
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
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  socialButtonText: {
    fontSize: 16,
  },
  likedButtonText: {
    color: '#e91e63',
  },
  disabledText: {
    color: '#999',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  completedTaskButton: {
    backgroundColor: '#81C784',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  completedButtonText: {
    color: '#fff',
  },
});