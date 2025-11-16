import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api/axiosConfig";

type RootStackParamList = {
  HomeScreen: undefined;
  VerificationScreen: { task: Task; onTaskComplete: (taskId: string | number) => void };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

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
  const [completedTasks, setCompletedTasks] = useState<Set<string | number>>(new Set(["recycle-1", "recycle-3"]));
  const [userTokens, setUserTokens] = useState<number>(10);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // const fetchTasks = async () => {
  //   try {
  //     const res = await api.post(
  //       '/get',
  //       { tasks },
  //       { withCredentials: true }
  //     );
  //     setTasks(res.data);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("HomeScreen focused - current completed tasks:", Array.from(completedTasks));
    }, [completedTasks])
  );
  
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

  const handleTaskComplete = (taskId: string | number) => {
    console.log("handleTaskComplete called with:", taskId);
    
    setCompletedTasks(prev => {
      const newCompleted = new Set(prev);
      newCompleted.add(taskId);
      console.log("Updated completed tasks:", Array.from(newCompleted));
      return newCompleted;
    });
    
    const allAvailableTasks = [...recyclingTasks, ...additionalTasks, ...tasks];
    const completedTask = allAvailableTasks.find(t => t.id === taskId);
    if (completedTask) {
      const newTokens = userTokens + completedTask.tokens;
      setUserTokens(newTokens);
      console.log(`Added ${completedTask.tokens} tokens. Total: ${newTokens}`);
    }
  };

  const handleTaskPress = (task: Task) => {
    if (completedTasks.has(task.id)) {
      console.log("Task already completed:", task.id);
      return;
    }
    
    console.log("Navigating to VerificationScreen with task:", task.id);
    
    navigation.navigate('VerificationScreen', { 
      task,
      onTaskComplete: handleTaskComplete
    });
  };

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
    }
  ];

  const recyclingTasks: Task[] = [
    {
      id: "recycle-2",
      title: "Plastic Bottle Recycling",
      body: "Collect and recycle 15 plastic bottles from your neighborhood",
      location: "Local Recycling Center",
      timestamp: "All Day",
      tokens: 15
    },
    {
      id: "recycle-1",
      title: "Vulture Tree Planting Day",
      body: "Plant vulture trees in designated areas to support local wildlife",
      location: "Community Park",
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
      title: "Clean our Oceans day",
      body: "Collect and recycle paper waste from seas",
      location: "Business District",
      timestamp: "All Day",
      tokens: 20
    }
  ];

  const allTasks = [...tasks, ...additionalTasks];

  const renderTaskContainer = (task: Task, index: number, isLiked: boolean, isCompleted: boolean) => {
    const taskContent = (
      <>
        <Text style={[
          styles.taskNumber,
          isCompleted && styles.completedText
        ]}>{index + 1})</Text>
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
        </View>
      </>
    );

    if (isCompleted) {
      return (
        <View 
          key={task.id} 
          style={[
            styles.taskContainer,
            styles.completedTask
          ]}
        >
          {taskContent}
        </View>
      );
    } else {
      return (
        <TouchableOpacity 
          key={task.id} 
          style={styles.taskContainer}
          onPress={() => handleTaskPress(task)}
        >
          {taskContent}
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.userInfo}>
              <Text style={styles.profileIcon}>👤</Text>
              <Text style={styles.username}>Maria</Text>
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
          {allTasks.map((task, index) => {
            const isLiked = likedTasks.has(task.id);
            const isCompleted = completedTasks.has(task.id);
            return renderTaskContainer(task, index, isLiked, isCompleted);
          })}

          {/* ACT AND WIN Section */}
          <Text style={styles.mainHeader}>ACT AND WIN</Text>
          {recyclingTasks.map((task, index) => {
            const isLiked = likedTasks.has(task.id);
            const isCompleted = completedTasks.has(task.id);
            return renderTaskContainer(task, index, isLiked, isCompleted);
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E2B4E',
  },
  container: {
    flex: 1,
    backgroundColor: '#1E2B4E',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#3498DB',
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
    color: '#ECF0F1',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ECF0F1',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F39C12',
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
    color: '#2C3E50',
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
    color: '#2ECC71',
  },
  logoNet: {
    color: '#3498DB',
  },
  tagline: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 4,
    fontStyle: 'italic',
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 30,
    color: '#3498DB',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    marginTop: 20,
    color: '#ECF0F1',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  taskContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#34495E',
    backgroundColor: '#2C3E50',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#E74C3C',
  },
  taskNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498DB',
    marginRight: 10,
    width: 25,
  },
  completedTask: {
    backgroundColor: '#34495E',
    opacity: 0.7,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#ECF0F1',
  },
  taskBody: {
    fontSize: 14,
    color: '#BDC3C7',
    marginBottom: 8,
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95A5A6',
  },
  taskDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  taskInfo: {
    fontSize: 12,
    color: '#BDC3C7',
    marginRight: 12,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495E',
  },
  likeButton: {
    backgroundColor: '#34495E',
  },
  likedButton: {
    backgroundColor: '#E74C3C',
  },
  disabledButton: {
    backgroundColor: '#2C3E50',
  },
  socialButtonText: {
    fontSize: 16,
  },
  likedButtonText: {
    color: '#E74C3C',
  },
  disabledText: {
    color: '#7F8C8D',
  },
});