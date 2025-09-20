
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJWprsSUOqwu1MgigpBIxmSOqu-b8gQK0",
  authDomain: "writeright-f8223.firebaseapp.com",
  projectId: "writeright-f8223",
  storageBucket: "writeright-f8223.firebasestorage.app",
  messagingSenderId: "77820924122",
  appId: "1:77820924122:web:e7a0b14600e2cbbc2a55e3",
  measurementId: "G-GR8MWXSTP2"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)