import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';

export default function VerificationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { task, onTaskComplete } = route.params as any;
  
  const [image, setImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      await requestPermissions();
    })();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      setCameraPermission(cameraStatus === 'granted');

      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus === 'granted');
    } catch (error) {
      console.log('Error requesting permissions:', error);
      Alert.alert("Error", "Failed to request camera/gallery permissions");
    }
  };

  const takePicture = async () => {
    if (cameraPermission === false) {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera access in your device settings to take pictures.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => {} }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking picture:', error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    if (galleryPermission === false) {
      Alert.alert(
        "Gallery Permission Required",
        "Please enable gallery access in your device settings to select images.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => {} }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!image) {
      Alert.alert("Error", "Please take or select a picture first");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onTaskComplete && task) {
        console.log("Marking task as completed:", task.id);
        onTaskComplete(task.id);
      }

      setShowSuccess(true);

    } catch (error) {
      console.log('Error submitting verification:', error);
      Alert.alert("Error", "Failed to submit verification. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSuccessContinue = () => {
    console.log("Navigating back to home screen");
    navigation.goBack();
  };

  const removeImage = () => {
    setImage(null);
  };

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>Task Completed!</Text>
            <Text style={styles.successSubtitle}>
              "{task?.title}" has been verified successfully!
            </Text>
            <Text style={styles.successTokens}>
              🪙 You earned {task?.tokens} tokens!
            </Text>
            <TouchableOpacity 
              style={styles.successButton}
              onPress={handleSuccessContinue}
            >
              <Text style={styles.successButtonText}>Continue to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Task Verification</Text>
          
          {task && (
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Task to Verify:</Text>
              <Text style={styles.taskName}>{task.title}</Text>
              <Text style={styles.taskDetails}>{task.body}</Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskMetaText}>📍 {task.location}</Text>
                <Text style={styles.taskMetaText}>💰 {task.tokens} tokens</Text>
                <Text style={styles.taskMetaText}>🕐 {task.timestamp}</Text>
              </View>
            </View>
          )}

          <Text style={styles.instruction}>
            Provide photo evidence of your completed task
          </Text>

          <View style={styles.imageSection}>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <Text style={styles.imageSuccessText}>✅ Photo ready for submission!</Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderIcon}>📷</Text>
                <Text style={styles.placeholderText}>No image selected</Text>
                <Text style={styles.placeholderSubtext}>
                  Take a picture or select one from your gallery
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          {!image ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cameraButton]} 
                onPress={takePicture}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>📷 Take Picture</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.galleryButton]} 
                onPress={pickImage}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>🖼️ Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.deleteButton]} 
                onPress={removeImage}
                disabled={isSubmitting}
              >
                <Text style={styles.confirmButtonText}>
                  {isSubmitting ? '⏳' : '🗑️'} Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.confirmButton, 
                  styles.continueButton,
                  isSubmitting && styles.continueButtonDisabled
                ]} 
                onPress={handleContinue}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>✅ Submit & Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {(cameraPermission === false || galleryPermission === false) && (
          <View style={styles.permissionWarning}>
            <Text style={styles.permissionWarningText}>
              ❗ Camera or gallery access is denied. Some features may not work properly.
            </Text>
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <Text style={styles.permissionButtonText}>Grant Permissions</Text>
            </TouchableOpacity>
          </View>
        )}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#BDC3C7',
  },
  successContainer: {
    backgroundColor: '#2C3E50',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#E74C3C',
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#BDC3C7',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  successTokens: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F39C12',
    marginBottom: 30,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  successButtonText: {
    color: '#ECF0F1',
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3498DB',
    marginBottom: 20,
    marginTop: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  taskInfo: {
    backgroundColor: '#2C3E50',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#E74C3C',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ECF0F1',
    marginBottom: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498DB',
    marginBottom: 8,
  },
  taskDetails: {
    fontSize: 14,
    color: '#BDC3C7',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#BDC3C7',
    marginRight: 15,
    marginBottom: 5,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#BDC3C7',
    marginBottom: 25,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 15,
    marginBottom: 15,
  },
  imageSuccessText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ECC71',
    textAlign: 'center',
    marginTop: 10,
  },
  placeholderContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495E',
    borderStyle: 'dashed',
    padding: 20,
  },
  placeholderIcon: {
    fontSize: 50,
    marginBottom: 15,
    color: '#BDC3C7',
  },
  placeholderText: {
    fontSize: 18,
    color: '#BDC3C7',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E2B4E',
    padding: 20,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#34495E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: '#3498DB',
  },
  galleryButton: {
    backgroundColor: '#9B59B6',
  },
  actionButtonText: {
    color: '#ECF0F1',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  continueButton: {
    backgroundColor: '#2ECC71',
  },
  continueButtonDisabled: {
    backgroundColor: '#27AE60',
    opacity: 0.7,
  },
  confirmButtonText: {
    color: '#ECF0F1',
    fontWeight: '600',
    fontSize: 16,
  },
  permissionWarning: {
    backgroundColor: '#F39C12',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E67E22',
    margin: 20,
    marginBottom: 120,
  },
  permissionWarningText: {
    color: '#2C3E50',
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 18,
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#E67E22',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
    fontSize: 14,
  },
});