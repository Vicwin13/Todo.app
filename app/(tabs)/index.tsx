import { useMutation, useQuery } from "convex/react";
import { ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Index() {
  const [taskText, setTaskText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const tasks = useQuery(api.task.getByStatus, { status: filter });
  const addTask = useMutation(api.task.add);
  const updateStatus = useMutation(api.task.updateStatus);
  const removeTask = useMutation(api.task.remove);
  const reorderTasks = useMutation(api.task.reorderTasks);

  const handleAddTask = () => {
    if (taskText.trim()) {
      addTask({ text: taskText, isCompleted: false });
      setTaskText("");
    }
  };

  const toggleStatus = (id: any, currentStatus: string) => {
    // convert "active"/"completed" to a boolean isCompleted, toggle it, and send the expected shape
    const currentIsCompleted = currentStatus === "completed";
    const newIsCompleted = !currentIsCompleted;
    updateStatus({ id, isCompleted: newIsCompleted });
  };

  const deleteTask = (id: any) => {
    removeTask({ id });
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (!tasks) return;
    
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    
    const taskIds = newTasks.map(task => task._id);
    reorderTasks({ taskIds });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
       <ImageBackground 
      source={{ uri: "https://res.cloudinary.com/dvjx9x8l9/image/upload/v1762256839/HNG/Bitmap_22_qbp7he.png" }} 
      style={styles.backgroundImage}
      >
        </ImageBackground>
              
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Todo App</Text>
              <TouchableOpacity style={styles.darkModeToggle} onPress={toggleDarkMode}>
                <Ionicons
                  name={isDarkMode ? "sunny" : "moon"}
                  size={24}
                  color={isDarkMode ? "#FFD700" : "#333"}
                  />
              </TouchableOpacity>
            </View>
          
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, filter === "all" && styles.activeFilter, isDarkMode && styles.darkFilterButton]}
                onPress={() => setFilter("all")}
              >
                <Text style={[styles.filterText, filter === "all" && styles.activeFilterText, isDarkMode && styles.darkFilterText]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === "active" && styles.activeFilter, isDarkMode && styles.darkFilterButton]}
                onPress={() => setFilter("active")}
              >
                <Text style={[styles.filterText, filter === "active" && styles.activeFilterText, isDarkMode && styles.darkFilterText]}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === "completed" && styles.activeFilter, isDarkMode && styles.darkFilterButton]}
                onPress={() => setFilter("completed")}
              >
                <Text style={[styles.filterText, filter === "completed" && styles.activeFilterText, isDarkMode && styles.darkFilterText]}>Completed</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isDarkMode && styles.darkInput]}
                placeholder="Add a new task..."
                placeholderTextColor={isDarkMode ? "#888" : "#666"}
                value={taskText}
                onChangeText={setTaskText}
                onSubmitEditing={handleAddTask}
              />
              <TouchableOpacity style={[styles.addButton, isDarkMode && styles.darkAddButton]} onPress={handleAddTask}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.taskList}>
              {tasks?.map(({ _id, text, isCompleted }, index) => (
                <TaskItem
                  key={_id}
                  id={_id}
                  name={text}
                  status={isCompleted ? "completed" : "active"}
                  index={index}
                  isDarkMode={isDarkMode}
                  onToggleStatus={toggleStatus}
                  onDelete={deleteTask}
                  onReorder={handleReorder}
                />
              ))}
            </View>
          </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}
// TaskItem component with drag and drop functionality using new Reanimated API
interface TaskItemProps {
  id: any;
  name: string;
  status: string;
  index: number;
  isDarkMode: boolean;
  onToggleStatus: (id: any, status: string) => void;
  onDelete: (id: any) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  name,
  status,
  index,
  isDarkMode,
  onToggleStatus,
  onDelete,
  onReorder
}) => {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  
  // New gesture handler using Reanimated v2+ API
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      // Calculate the new position based on the drag distance
      const dragDistance = event.translationY;
      const itemHeight = 70; // Approximate height of a task item
      const newPosition = Math.round(dragDistance / itemHeight);
      
      if (newPosition !== 0) {
        runOnJS(onReorder)(index, index + newPosition);
      }
      
      translateY.value = withSpring(0);
    })
    .onFinalize(() => {
      isDragging.value = false;
      translateY.value = withSpring(0);
    });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      zIndex: isDragging.value ? 1000 : 1,
      opacity: isDragging.value ? 0.8 : 1,
    };
  });
  
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[
        styles.taskItem,
        animatedStyle,
        isDarkMode && styles.darkTaskItem
      ]}>
        <TouchableOpacity
          style={styles.dragHandle}
          // Add activeOpacity to make it clear it's draggable
          activeOpacity={0.7}
        >
          <Ionicons name="reorder-four" size={20} color={isDarkMode ? "#888" : "#666"} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => onToggleStatus(id, status)}
        >
          <View style={[
            styles.radioCircle,
            status === "completed" && styles.radioSelected,
            isDarkMode && styles.darkRadioCircle
          ]}>
            {status === "completed" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
        
        <Text style={[
          styles.taskText,
          status === "completed" && styles.completedText,
          isDarkMode && styles.darkTaskText
        ]}>
          {name}
        </Text>
        
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
          <Ionicons name="close" size={20} color="#ff4d4d" />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};
const styles = StyleSheet.create({
    backgroundImage: {
    flex: 1,
    width: "100%",
    height: "30%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    position:"relative",
  },
  darkContainer: {
    backgroundColor: "#1a1a1a",
  },
  safeArea: {
    flex: 1,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  darkTitle: {
    color: "#f0f0f0",
  },
  darkModeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  darkFilterButton: {
    backgroundColor: "#333",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  filterText: {
    fontSize: 16,
    color: "#333",
  },
  darkFilterText: {
    color: "#f0f0f0",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "bold",
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
  darkInput: {
    backgroundColor: "#2a2a2a",
    color: "#f0f0f0",
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  darkAddButton: {
    backgroundColor: "#0a4d8a",
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
  darkTaskItem: {
    backgroundColor: "#2a2a2a",
  },
  dragHandle: {
    marginRight: 10,
    padding: 5,
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
  darkRadioCircle: {
    borderColor: "#0a4d8a",
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
    color: "#333",
  },
  darkTaskText: {
    color: "#f0f0f0",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  deleteButton: {
    padding: 5,
  },
});
