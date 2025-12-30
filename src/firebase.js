import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: "canteen-q-dca20.firebaseapp.com",
  projectId: "canteen-q-dca20",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
