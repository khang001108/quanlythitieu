import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Salary({ user, salary, setSalary }) {
  const [loading, setLoading] = useState(true);
  const [inputMonth, setInputMonth] = useState(0); // tháng hiện tại chọn
  const [inputValue, setInputValue] = useState("");

  // 🔹 Lấy salary từ Firestore
  useEffect(() => {
    if (!user) return;
    const fetchSalary = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const s = docSnap.exists() ? docSnap.data().salary || {} : {};
        setSalary(s);
        setInputValue(s[inputMonth] || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalary();
  }, [user]);

  // 🔹 Cập nhật salary tháng
  const handleSave = async () => {
    if (!user) return;
    const val = Number(inputValue);
    if (isNaN(val) || val < 0) {
      alert("Nhập số hợp lệ");
      return;
    }
    const newSalary = { ...salary, [inputMonth]: val };
    setSalary(newSalary);
    try {
      await setDoc(doc(db, "users", user.uid), { salary: newSalary }, { merge: true });
      alert("Cập nhật lương tháng " + monthNames[inputMonth] + " thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  if (!user) return null;
  if (loading) return <div>Đang tải lương...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <label className="block text-gray-700 font-semibold mb-2">Chọn tháng:</label>
      <select
        value={inputMonth}
        onChange={(e) => {
          const m = Number(e.target.value);
          setInputMonth(m);
          setInputValue(salary[m] || "");
        }}
        className="border rounded-lg p-2 mb-2 w-full"
      >
        {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>

      <div className="flex gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập lương tháng..."
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
