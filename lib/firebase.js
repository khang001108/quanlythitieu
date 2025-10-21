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

// ✅ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// ✅ Xuất Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Analytics — chỉ chạy nếu có `window`
let analytics = null;
if (typeof window !== "undefined") {
  // import động chỉ khi chạy ở trình duyệt
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("✅ Firebase Analytics enabled");
      } else {
        console.log("⚠️ Firebase Analytics not supported in this browser");
      }
    });
  });
}

export { app, analytics };
