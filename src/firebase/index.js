// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwxiahCi-SYvp6-c08rAykRJVz3HmxmE8",
  authDomain: "hafta-ici.firebaseapp.com",
  projectId: "hafta-ici",
  storageBucket: "hafta-ici.appspot.com",
  messagingSenderId: "142143091513",
  appId: "1:142143091513:web:97ee737ec54ef2dac6aee8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// firebase auth referansını al
export const auth = getAuth(app);

// gogle sağlayıcısını kur
export const provider = new GoogleAuthProvider();

// firestore veritabanı referansını al
export const db = getFirestore(app);
