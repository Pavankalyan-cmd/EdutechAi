// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADILPoIwVIU0qc6Mq04fGBsaYhTEFhQDo",
  authDomain: "edutech-9fa88.firebaseapp.com",
  projectId: "edutech-9fa88",
  storageBucket: "edutech-9fa88.firebasestorage.app",
  messagingSenderId: "968230742014",
  appId: "1:968230742014:web:dc118ed3f910bcd3d7c2af",
  measurementId: "G-VPK67Y3KF3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, doc, setDoc, signInWithPopup, signOut };
