// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU71SqoPEOXGc0VuL0bgkQ_aNsBDGltMQ",
  authDomain: "krushisarthi-be143.firebaseapp.com",
  projectId: "krushisarthi-be143",
  storageBucket: "krushisarthi-be143.firebasestorage.app",
  messagingSenderId: "865127188679",
  appId: "1:865127188679:web:2c9f164bfdd1f7444bd6e2",
  measurementId: "G-XCNXMFQ28G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
