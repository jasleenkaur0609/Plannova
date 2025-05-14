// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIuAYpidaZgu8KUmjc8MlovorSyK-SXdM",
  authDomain: "ems-mern-f0b16.firebaseapp.com",
  projectId: "ems-mern-f0b16",
  storageBucket: "ems-mern-f0b16.firebasestorage.app",
  messagingSenderId: "369114516660",
  appId: "1:369114516660:web:d95de43db5d658eafb9be1",
  measurementId: "G-5D17QHFQQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };