import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [inputs, setInputs] = useState({});
  const [fabMenuVisible, setFabMenuVisible] = useState(false); // NEW state
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(list);
    });

    return unsubscribe;
  }, []);

  // DELETE FUNCTION
  const handleDelete = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const docRef = doc(db, "goals", id);
            await deleteDoc(docRef);
          } catch (error) {
            console.log("Error deleting task:", error);
          }
        },
      },
    ]);
  };

  // SUBMIT WRITING FUNCTION
  const handleSubmitWriting = async (
    id,
    inputText,
    currentProgress,
    wordGoal,
    title
  ) => {
    if (!inputText.trim()) return;

    const wordCount = inputText.trim().split(/\s+/).length;
    let newProgress = currentProgress + wordCount;

    if (newProgress > wordGoal) newProgress = wordGoal;

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, { progress: newProgress });
      setInputs((prev) => ({ ...prev, [id]: "" }));

      if (newProgress >= wordGoal) {
        Alert.alert("🎉 Congrats!", `You’ve completed "${title}"!`);
      }
    } catch (error) {
      console.log("Error updating progress:", error);
    }
  };

  // RENDER PROGRESS BAR
  const renderProgressBar = (progress, goal) => {
    const percentage = goal > 0 ? (progress / goal) * 100 : 0;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Writing Goals</Text>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isCompleted = item.progress >= item.wordGoal;

          return (
            <View
              style={[
                styles.goalCard,
                isCompleted && { borderColor: "#21cc8d", borderWidth: 2 },
              ]}
            >
              <View style={styles.headerRow}>
                <Text style={styles.goalText}>
                  {item.title || "Untitled Task"}
                  {isCompleted ? " 🎉" : ""}
                </Text>
                <Pressable
                  onPress={() =>
                    setMenuVisible(menuVisible === item.id ? null : item.id)
                  }
                >
                  <Ionicons name="ellipsis-vertical" size={22} color="#21cc8d" />
                </Pressable>
              </View>

              <Text style={styles.progressText}>
                {item.progress ?? 0} / {item.wordGoal ?? 0} words
              </Text>

              {renderProgressBar(item.progress ?? 0, item.wordGoal ?? 0)}

              {/* Writing Input */}
              <TextInput
                style={styles.input}
                placeholder="Type your words here..."
                placeholderTextColor="#888"
                value={inputs[item.id] || ""}
                onChangeText={(text) =>
                  setInputs((prev) => ({ ...prev, [item.id]: text }))
                }
                multiline
              />
              <Pressable
                style={styles.submitButton}
                onPress={() =>
                  handleSubmitWriting(
                    item.id,
                    inputs[item.id],
                    item.progress ?? 0,
                    item.wordGoal,
                    item.title || "Untitled Goal"
                  )
                }
              >
                <Text style={styles.submitButtonText}>Submit Writing</Text>
              </Pressable>

              {/* Menu */}
              {menuVisible === item.id && (
                <Modal
                  transparent
                  animationType="fade"
                  visible={true}
                  onRequestClose={() => setMenuVisible(null)}
                >
                  <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setMenuVisible(null)}
                  >
                    <View style={styles.menu}>
                      <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                          setMenuVisible(null);
                          router.push(`/goals/edit/${item.id}`);
                        }}
                      >
                        <Ionicons name="pencil" size={18} color="#232b2b" />
                        <Text style={styles.menuText}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={styles.menuItem}
                        onPress={() => {
                          setMenuVisible(null);
                          handleDelete(item.id);
                        }}
                      >
                        <Ionicons name="trash" size={18} color="red" />
                        <Text style={[styles.menuText, { color: "red" }]}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </Modal>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No goals yet. Add one!</Text>
        }
      />

      {/* Floating Action Button + Logout */}
      <View style={styles.fabContainer}>
        {fabMenuVisible && (
          <Pressable style={styles.fabOption} onPress={() => signOut(auth)}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </Pressable>
        )}

        <Pressable
          style={styles.fab}
          onPress={() => setFabMenuVisible((prev) => !prev)}
        >
          <Ionicons
            name={fabMenuVisible ? "close" : "add"}
            size={28}
            color="white"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232b2b",
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#21cc8d",
    textAlign: "center",
    marginBottom: 16,
  },
  goalCard: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#2f3838",
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  progressText: {
    fontSize: 14,
    color: "#b0b0b0",
    marginTop: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#444",
    borderRadius: 4,
    marginTop: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#21cc8d",
  },
  input: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: "top",
    fontSize: 15,
  },
  submitButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#21cc8d",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    width: 160,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 8,
  },
  menuText: {
    fontSize: 15,
    color: "#232b2b",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#aaa",
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "center",
  },
  fab: {
    backgroundColor: "#21cc8d",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabOption: {
    backgroundColor: "#e63946",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
});
