import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Animated } from "react-native";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

const quotes = [
  "A word after a word after a word is power. – Margaret Atwood",
  "The scariest moment is always just before you start. – Stephen King",
  "Don’t get it right, just get it written. – James Thurber",
  "You can make anything by writing. – C.S. Lewis",
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setUser(user);
        setLoading(false);
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#21cc8d" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#232b2b", "#1a1f1f"]} style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>WriteRight</Text>
      <Text style={styles.subtitle}>
        {user ? `Welcome back, ${user.email.split("@")[0]}!` : "Shape Your Words, Reach Your Goals"}
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Link href="/goals" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardEmoji}>📚</Text>
            <Text style={styles.cardText}>View Your Writings</Text>
          </Pressable>
        </Link>

        <Link href="/goals/create" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardEmoji}>➕</Text>
            <Text style={styles.cardText}>Start a New Writing</Text>
          </Pressable>
        </Link>
      </View>

      {/* Quote Box */}
      <View style={styles.quoteBox}>
        <Text style={styles.quote}>“{quote}”</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#232b2b",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#21cc8d",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#d1d1d1",
    marginBottom: 30,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#2f3838",
    width: "90%",
    padding: 18,
    borderRadius: 16,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  cardEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  quoteBox: {
    marginTop: 50,
    backgroundColor: "#2f3838",
    padding: 16,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  quote: {
    fontStyle: "italic",
    fontSize: 15,
    color: "#d1d1d1",
    textAlign: "center",
  },
});

export default Home;
