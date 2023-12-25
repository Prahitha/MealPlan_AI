// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjQhXNVsEvOhjD1PP6Wy0PJd5fVpeAv1M",
  authDomain: "mealplan-ai-8c37a.firebaseapp.com",
  projectId: "mealplan-ai-8c37a",
  storageBucket: "mealplan-ai-8c37a.appspot.com",
  messagingSenderId: "47575484986",
  appId: "1:47575484986:web:d456548b443df6d4d70303",
  measurementId: "G-R4D2CLMSVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
// Initialize other Firebase services as needed

export { auth, firestore };
