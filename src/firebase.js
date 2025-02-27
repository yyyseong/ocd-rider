// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase 설정 정보 (제공된 SDK 설정 사용)
const firebaseConfig = {
  apiKey: "AIzaSyAXg1KDZyZrTYvke6qAFyT4l180W6PnYNc",
  authDomain: "ocd-rider.firebaseapp.com",
  projectId: "ocd-rider",
  storageBucket: "ocd-rider.firebasestorage.app",
  messagingSenderId: "713358730330",
  appId: "1:713358730330:web:0f85f5bac7cccfc1c6a463",
  measurementId: "G-TMTXG9SLS8"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
