import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { GoalsProvider } from '../../contexts/GoalsContext'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native"

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login")
      }
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#232b2b" }}>
        <ActivityIndicator size="large" color="#21cc8d" />
      </View>
    )
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#21cc8d",
          tabBarInactiveTintColor: "#cccccc",
          tabBarStyle: {
            backgroundColor: "#232b2b",
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Your Writings",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={24}
                name={focused ? "book" : "book-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "New Writing",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={24}
                name={focused ? "create" : "create-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="edit/[id]"
          options={{
            href: null,
            headerShown: false,
            title: "Edit Writing",
          }}
        />
      </Tabs>
    </GoalsProvider>
  )
}
