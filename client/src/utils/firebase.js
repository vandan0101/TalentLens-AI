
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "talentlens-ai-53cf7.firebaseapp.com",
  projectId: "talentlens-ai-53cf7",
  storageBucket: "talentlens-ai-53cf7.firebasestorage.app",
  messagingSenderId: "724406665100",
  appId: "1:724406665100:web:f73a97f32cfb670f3520a9",
  measurementId: "G-4TY8SPPE4D"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}