import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Configuración actualizada para el proyecto pool-btc
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAx8f05QelefYQKKcaLhBFHZz5uQcLA768",
  authDomain: "pool-btc.firebaseapp.com",
  projectId: "pool-btc",
  storageBucket: "pool-btc.firebasestorage.app",
  messagingSenderId: "1018976881268",
  appId: "1:1018976881268:web:2ae49a483b126442c7df21",
  measurementId: "G-QN5F28JF81"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };
export default app;
