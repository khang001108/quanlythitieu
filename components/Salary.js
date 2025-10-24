import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const monthNames = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

export default function Salary({ user, salary, setSalary, selectedMonth }) {
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // 🔹 Lấy lương từ Firestore
  useEffect(() => {
    if (!user) return;
    const fetchSalary = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data().salary || {};
          setSalary(data);
          setInputValue(data[selectedMonth] || "");
        } else {
          setSalary({});
        }
      } catch (err) {
        console.error("Lỗi tải lương:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalary();
  }, [user]);

  // 🔹 Cập nhật khi đổi tháng được chọn
  useEffect(() => {
    if (salary) setInputValue(salary[selectedMonth] || "");
  }, [selectedMonth, salary]);

  // 🔹 Cập nhật lương tháng lên Firestore
  const handleSave = async () => {
    if (!user) return alert("Bạn cần đăng nhập");
    const val = Number(inputValue);
    if (isNaN(val) || val < 0) return alert("Vui lòng nhập số hợp lệ");

    const newSalary = { ...salary, [selectedMonth]: val };
    setSalary(newSalary);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        { salary: newSalary },
        { merge: true }
      );
      alert(`✅ Cập nhật lương ${monthNames[selectedMonth]} thành công!`);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("❌ Cập nhật thất bại!");
    }
  };

  if (!user) return null;
  if (loading) return <div>Đang tải dữ liệu lương...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-700 font-semibold mb-2">
        Lương {monthNames[selectedMonth]}:
      </p>
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
