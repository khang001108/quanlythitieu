import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function Salary({
  user,
  salary,
  setSalary,
  selectedMonth,
  selectedYear,
}) {
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState(null); // ✅ hoặc ❌ trạng thái lưu

  // 🔹 Lấy dữ liệu lương từ Firestore
  useEffect(() => {
    if (!user) return;
    const fetchSalary = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data().salary || {};
          setSalary(data);
          const yearData = data[String(selectedYear)] || {};
          //setInputValue(yearData[String(selectedMonth)] || "");
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
  }, [user, selectedMonth, selectedYear]);

  // 🔹 Cập nhật khi đổi tháng hoặc năm được chọn
  useEffect(() => {
    if (salary) {
      const yearData = salary[selectedYear] || {};
      //setInputValue(yearData[selectedMonth] || "");
    }
  }, [selectedMonth, selectedYear, salary]);

  // 🔹 Lưu lương tháng-năm lên Firestore
  const handleSave = async () => {
    if (!user) return alert("Bạn cần đăng nhập");
    const val = Number(inputValue);
    if (isNaN(val) || val < 0) return alert("Vui lòng nhập số hợp lệ");

    const newSalary = {
      ...salary,
      [String(selectedYear)]: {
        ...(salary[String(selectedYear)] || {}),
        [String(selectedMonth)]: val,
      },
    };
    setSalary(newSalary);

    setStatus("loading");
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { salary: newSalary },
        { merge: true }
      );
      setStatus("success");
      setInputValue("");
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setStatus("error");
      setTimeout(() => setStatus(null), 2500);
    }
  };

  if (!user) return null;

  if (loading)
    return (
      <div className="bg-white p-6 rounded-xl shadow flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Đang tải dữ liệu lương...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md border border-gray-100 transition hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-700 font-semibold text-lg">
          💼 Lương {monthNames[selectedMonth]} năm {selectedYear}
        </p>
        {status === "success" && (
          <span className="text-green-600 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-1" /> Đã lưu
          </span>
        )}
        {status === "error" && (
          <span className="text-red-600 flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-1" /> Lưu thất bại
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mt-3 text-left">
        Nhập lương tháng
      </p>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ₫
          </span>
          <input
            type="text"
            value={inputValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              if (!/^\d*$/.test(raw)) return;
              setInputValue(raw);
            }}
            placeholder="Nhập số tiền"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-gray-800"
            inputMode="numeric"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={status === "loading"}
          className={`px-2 py-2 rounded-lg text-white font-medium transition ${
            status === "loading"
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin w-4 h-4 mr-1" /> Đang lưu...
            </span>
          ) : (
            "Cập nhật"
          )}
        </button>
      </div>

      
    </div>
  );
}
