// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzi9I0sD-XVEwkelntcYvv23YoZS1x8Rk",
  authDomain: "online-marketplace-75a0f.firebaseapp.com",
  projectId: "online-marketplace-75a0f",
  storageBucket: "online-marketplace-75a0f.firebasestorage.app",
  messagingSenderId: "1094433574975",
  appId: "1:1094433574975:web:b9c2cad99a30f82da3288a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);