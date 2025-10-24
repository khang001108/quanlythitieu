// pages/index.js
import { useState, useEffect } from "react";
import Salary from "../components/Salary";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Summary from "../components/Summary";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseMonth from "../components/ExpenseMonth";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut, Trash2, User2 } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState({});
  const [items, setItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc muốn đăng xuất?")) return;
    await signOut(auth);
    setUser(null);
    setItems([]);
    setSalary({});
  };

  const handleDeleteAll = async () => {
    if (!confirm("Xóa toàn bộ dữ liệu tháng này (chi tiêu + lương)?")) return;

    try {
      const {
        collection,
        query,
        where,
        getDocs,
        deleteDoc,
        doc,
        getDoc,
        updateDoc,
      } = await import("firebase/firestore");

      // Xóa chi tiêu
      const q1 = query(
        collection(db, "expenses"),
        where("userId", "==", user.uid),
        where("month", "==", selectedMonth),
        where("year", "==", selectedYear)
      );
      const snap1 = await getDocs(q1);
      const delExpenses = snap1.docs.map((d) =>
        deleteDoc(doc(db, "expenses", d.id))
      );

      // Xóa lương
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const salary = userData.salary || {};

        if (
          salary[selectedYear] &&
          salary[selectedYear][selectedMonth] !== undefined
        ) {
          delete salary[selectedYear][selectedMonth];
          if (Object.keys(salary[selectedYear]).length === 0)
            delete salary[selectedYear];

          await updateDoc(userRef, { salary });
          setSalary((prev) => {
            const copy = { ...prev };
            if (copy[selectedYear]?.[selectedMonth] !== undefined) {
              delete copy[selectedYear][selectedMonth];
              if (Object.keys(copy[selectedYear]).length === 0)
                delete copy[selectedYear];
            }
            return { ...copy };
          });
        }
      }

      await Promise.all(delExpenses);
      setItems([]);
      alert(
        `Đã xóa toàn bộ dữ liệu tháng ${selectedMonth + 1}/${selectedYear}.`
      );
    } catch (e) {
      console.error(e);
      alert("❌ Xóa thất bại.");
    }
  };

  // =======================
  // Giao diện login
  // =======================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-80">
          <h2 className="text-xl font-bold mb-3 text-gray-800">
            Bạn chưa đăng nhập
          </h2>
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Đến trang đăng nhập
          </a>
        </div>
      </div>
    );
  }

  // =======================
  // Giao diện chính
  // =======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-10">
      <div className="max-w-2xl mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="flex flex-col bg-white shadow p-4 rounded-xl sticky top-0 z-20 backdrop-blur-md bg-opacity-95 space-y-2 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              💰 Quản Lý Chi Tiêu
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <User2 className="w-4 h-4" />
              <span>{user.displayName || "Người dùng ẩn danh"}</span>
              <span className="text-gray-400">|</span>
              <span className="font-mono text-xs truncate max-w-[150px]">
                {user.uid}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2 sm:pt-0">
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm transition"
            >
              <Trash2 className="w-4 h-4" /> Xóa
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 text-sm transition"
            >
              <LogOut className="w-4 h-4" /> Thoát
            </button>
          </div>
        </div>

        {/* Bộ chọn tháng/năm */}
        <div className="bg-white rounded-xl shadow p-3">
          <ExpenseMonth
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </div>

        {/* 🔹 Tổng hợp nhanh (bình thường) */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <Summary
            items={items}
            salary={salary}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        {/* 🔹 Nội dung chính */}
        <div className="space-y-5">
          <Salary
            user={user}
            salary={salary}
            setSalary={setSalary}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <ExpenseForm
            user={user}
            setItems={setItems}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <ExpenseList
            user={user}
            items={items}
            setItems={setItems}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <ExpenseChart
            items={items}
            salary={salary}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>
    </div>
  );
}
