import { useMutation, useQuery } from "convex/react";
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function CompletedTasks() {
  const [taskText, setTaskText] = useState("");
  const tasks = useQuery(api.task.getByStatus, { status: "completed" });
  const addTask = useMutation(api.task.add);
  const updateStatus = useMutation(api.task.updateStatus);
  const removeTask = useMutation(api.task.remove);

  const handleAddTask = () => {
    if (taskText.trim()) {
      addTask({ text: taskText });
      setTaskText("");
    }
  };

  const toggleStatus = (id: any, currentStatus: string) => {
    const newIsCompleted = currentStatus !== "completed";
    updateStatus({ id, isCompleted: newIsCompleted });
  };

  const deleteTask = (id: any) => {
    removeTask({ id });
  };

  return (
    <ImageBackground 
      source={{ uri: "https://res.cloudinary.com/dvjx9x8l9/image/upload/v1762256839/HNG/Bitmap_22_qbp7he.png" }} 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Completed Tasks</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add a new task..."
                value={taskText}
                onChangeText={setTaskText}
                onSubmitEditing={handleAddTask}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.taskList}>
              {tasks?.map(({ _id, text, isCompleted }) => (
                <View key={_id} style={styles.taskItem}>
                  <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => toggleStatus(_id, isCompleted ? "completed" : "active")}
                  >
                    <View style={[styles.radioCircle, isCompleted && styles.radioSelected]}>
                      {isCompleted && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                  
                  <Text style={[styles.taskText, isCompleted && styles.completedText]}>
                    {text}
                  </Text>
                  
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(_id)}>
                    <Ionicons name="close" size={20} color="#ff4d4d" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "50%",
  },
  container: {
    flex: 1,
    position:'relative'
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
      width: 750,
    position: 'absolute',
     top: '20%',
    left: '50%',
    transform: [
        { translateX: -375 },
        { translateY: -100 } 
    ],
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioButton: {
    marginRight: 15,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: "#007bff",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  deleteButton: {
    padding: 5,
  },
});