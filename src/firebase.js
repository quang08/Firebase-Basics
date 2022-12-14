// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaILtuHRvWNYFFLxt-k2sdwPQIEGT4TsY",
  authDomain: "test-b8efe.firebaseapp.com",
  projectId: "test-b8efe",
  storageBucket: "test-b8efe.appspot.com",
  messagingSenderId: "1034137105167",
  appId: "1:1034137105167:web:350768f25b5fa45fb4c47a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database and Auth Services
export const db = getFirestore(app);
export const auth = getAuth(app);