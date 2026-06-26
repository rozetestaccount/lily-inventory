import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkYV2UKENxsJaVKliLASQJbHdumLFu6h8",
  authDomain: "lily-inventory-bd3f1.firebaseapp.com",
  projectId: "lily-inventory-bd3f1",
  storageBucket: "lily-inventory-bd3f1.firebasestorage.app",
  messagingSenderId: "523728180731",
  appId: "1:523728180731:web:23806ad188f8043bffa75e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
