// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABE9JYV43lQxo8VUoL7VK7LVQwTt2Ab6k",
  authDomain: "brainbuilders-73491.firebaseapp.com",
  projectId: "brainbuilders-73491",
  storageBucket: "brainbuilders-73491.appspot.com",
  messagingSenderId: "34960600530",
  appId: "1:34960600530:web:e65f5d74ce587d663aec0b",
  measurementId: "G-4Y0XSQXBW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
//const analytics = getAnalytics(app);