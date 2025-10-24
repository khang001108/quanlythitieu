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

export default function Home() {
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState({});
  const [items, setItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  // NOTE: removed the effect that cleared items/salary on month/year change.
  // Clearing here caused the UI to briefly be empty and sometimes not pick up onSnapshot fast enough.
  // Instead we let the ExpenseList onSnapshot manage live updates.

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc muốn đăng xuất?")) return;
    await signOut(auth);
    setUser(null);
    setItems([]);
    setSalary({});
  };

  const handleDeleteAll = async () => {
    if (!confirm("Xóa tất cả khoản chi của bạn?")) return;
    try {
      // delete all expenses for this user
      const { collection, query, where, getDocs, deleteDoc, doc } = await import("firebase/firestore");
      const q = query(collection(db, "expenses"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const promises = snap.docs.map(d => deleteDoc(doc(db, "expenses", d.id)));
      await Promise.all(promises);
      setItems([]);
      alert("Đã xóa toàn bộ chi tiêu.");
    } catch (e) {
      console.error(e);
      alert("Xóa thất bại.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-3">Bạn chưa đăng nhập</h2>
          <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Đến trang đăng nhập</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản Lý Chi Tiêu</h1>
        <div className="flex gap-2">
          <button onClick={handleDeleteAll} className="bg-red-500 text-white px-3 py-1 rounded">Xóa tất cả</button>
          <button onClick={handleLogout} className="bg-gray-600 text-white px-3 py-1 rounded">Đăng xuất</button>
        </div>
      </div>

      <ExpenseMonth
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <Salary user={user} salary={salary} setSalary={setSalary} selectedMonth={selectedMonth} />

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

      <Summary items={items} salary={salary} selectedMonth={selectedMonth} />
      <ExpenseChart items={items} salary={salary} selectedMonth={selectedMonth} />
    </div>
  );
}
