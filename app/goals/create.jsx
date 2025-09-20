import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'

const Create = () => {
  const [title, setTitle] = useState('')
  const [wordGoal, setWordGoal] = useState('')
  const { createGoal } = useGoals()
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim() || !wordGoal.trim()) return;

    await createGoal({
      title: title,
      wordGoal: parseInt(wordGoal),
      progress: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    })

    setTitle('')
    setWordGoal('')
    Keyboard.dismiss()
    router.push('/goals')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>New Writing Tasks</Text>
      <Text style={styles.subtitle}>Set your goal and start writing</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Target word count (e.g. 300)"
          placeholderTextColor="#888"
          value={wordGoal}
          onChangeText={setWordGoal}
          keyboardType="numeric"
        />

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Create Writing Task</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232b2b',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#21cc8d',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d1d1',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#21cc8d',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})
