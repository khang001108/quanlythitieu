// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDu0zTlfhQ6swsRxzsaYCZX-iu_Kb1vqZ4",
  authDomain: "quanlychitieu-17fff.firebaseapp.com",
  projectId: "quanlychitieu-17fff",
  storageBucket: "quanlychitieu-17fff.firebasestorage.app",
  messagingSenderId: "98380812271",
  appId: "1:98380812271:web:8fb497f631c1bd1729f01a",
  measurementId: "G-QCC030XPH9",
};

// ✅ Khởi tạo app (chỉ 1 lần)
const app = initializeApp(firebaseConfig);

// ✅ Thêm Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Analytics — chỉ chạy nếu đang ở trình duyệt
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
