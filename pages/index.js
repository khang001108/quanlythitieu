import { useState, useEffect } from "react";
import Salary from "../components/Salary";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import Summary from "../components/Summary";
import ExpenseChart from "../components/ExpenseChart";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState("");
  const [items, setItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 🔹 Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Bạn chưa đăng nhập
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

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc muốn đăng xuất không?")) return;
    await signOut(auth);
    setItems([]);
    setSalary("");
  };

  // 🔹 Xóa tất cả chi tiêu của user
  const handleDeleteAll = async () => {
    if (!confirm("Bạn có chắc muốn xóa tất cả chi tiêu? Hành động này không thể khôi phục!")) return;
    try {
      const q = query(collection(db, "expenses"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const promises = snapshot.docs.map((d) => deleteDoc(doc(db, "expenses", d.id)));
      await Promise.all(promises);
      setItems([]);
      alert("Đã xóa toàn bộ chi tiêu!");
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Quản Lý Chi Tiêu</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAll}
            className="text-sm text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Xóa tất cả
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-white bg-gray-500 px-3 py-1 rounded-lg hover:bg-gray-600"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Chọn tháng & năm */}
      <div className="flex gap-2 items-center">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded p-2"
        >
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded p-2 w-24"
        />
        <button
          onClick={() => setSelectedMonth(selectedMonth)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Chọn
        </button>
      </div>

      {/* Salary */}
      <Salary user={user} salary={salary} setSalary={setSalary} />

      {/* Expense */}
      <ExpenseForm user={user} setItems={setItems} selectedMonth={selectedMonth} selectedYear={selectedYear} />
      <ExpenseList user={user} items={items} setItems={setItems} selectedMonth={selectedMonth} selectedYear={selectedYear} />

      {/* Summary & Chart */}
      <Summary items={items} salary={salary} />
      <ExpenseChart items={items} salary={salary} />
    </div>
  );
}
