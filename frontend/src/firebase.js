import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACv8J9dLMZnQe2wcHTO7ytLAsycgWsWeg",
  authDomain: "intership-system-8f17d.firebaseapp.com",
  projectId: "intership-system-8f17d",
  storageBucket: "intership-system-8f17d.firebasestorage.app",
  messagingSenderId: "745472942714",
  appId: "1:745472942714:web:70590167a7ca9851c551c3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
