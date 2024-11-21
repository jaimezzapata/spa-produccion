import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAUpxI5wfiQnX79cUTcJj_eoWVpppVOOFg",
    authDomain: "appspa-1348d.firebaseapp.com",
    projectId: "appspa-1348d",
    storageBucket: "appspa-1348d.firebasestorage.app",
    messagingSenderId: "435172714248",
    appId: "1:435172714248:web:4f845c886bcc8a74fb2ebd"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
