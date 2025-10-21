// components/Salary.js
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Salary({ user, salary, setSalary }) {
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState(""); // giá trị input tạm

  // 🔹 Lấy salary từ Firestore khi user thay đổi
  useEffect(() => {
    if (!user) return;

    const fetchSalary = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const s = docSnap.data().salary || "";
          setSalary(s);
          setInput(s);
        } else {
          setSalary("");
          setInput("");
        }
      } catch (err) {
        console.error("Lấy salary thất bại:", err);
        setSalary("");
        setInput("");
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [user, setSalary]);

  // 🔹 Cập nhật salary lên Firestore
  const handleSave = async () => {
    if (!user) return;
    const newSalary = Number(input);
    if (isNaN(newSalary) || newSalary < 0) {
      alert("Vui lòng nhập số lương hợp lệ");
      return;
    }

    try {
      setSalary(newSalary);
      await setDoc(doc(db, "users", user.uid), { salary: newSalary }, { merge: true });
      alert("Cập nhật lương thành công!");
    } catch (err) {
      console.error("Lưu salary thất bại:", err);
      alert("Cập nhật lương thất bại, xem console để biết lý do.");
    }
  };

  if (!user) return null;
  if (loading) return <div>Đang tải lương...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <label className="block text-gray-700 font-semibold mb-2">Lương tháng:</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
