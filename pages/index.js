// pages/index.js
import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Summary from "../components/Summary";
import ExpenseChart from "../components/ExpenseChart";
import Salary from "../components/Salary";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const [items, setItems] = useState([]);
  const [salary, setSalary] = useState(0);
  const [user, setUser] = useState(null);

  // 🔹 Kiểm tra trạng thái đăng nhập Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setItems([]);
    setSalary(0);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Vui lòng đăng nhập để sử dụng ứng dụng
          </h2>
          <a
            href="/login"
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Đến trang đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Quản Lý Chi Tiêu</h1>
        <p className="text-sm text-gray-600 mt-1">
          Tài khoản: <span className="font-medium">{user?.email || user?.uid}</span>
        </p>
        <button
          onClick={() => {
            if (confirm("Bạn có chắc muốn đăng xuất không?")) {
              handleLogout();
            }
          }}
          className="text-sm text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>

      {/* Salary */}
      <Salary user={user} salary={salary} setSalary={setSalary} />

      {/* Expense */}
      <ExpenseForm setItems={setItems} user={user} />
      <ExpenseList items={items} setItems={setItems} user={user} />
      <Summary items={items} salary={salary} />
      <ExpenseChart items={items} salary={salary} />
    </div>
  );
}
