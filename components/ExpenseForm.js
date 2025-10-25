import { useState, useRef, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export default function ExpenseForm({
  user,
  setItems,
  selectedMonth,
  selectedYear,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // 🔹 Mặc định hôm nay
  const modalRef = useRef();
  const [toast, setToast] = useState(null);

  // Đóng popup khi nhấn Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập");
    if (!name || !amount) return alert("Nhập đầy đủ thông tin");

    const newExpense = {
      userId: user.uid,
      name,
      amount: Number(amount),
      date: new Date(date).toISOString(), // 🔹 Lưu theo ngày chọn
      month: Number(selectedMonth),
      year: Number(selectedYear),
      createdAt: serverTimestamp(),
    };

    try {
      const ref = await addDoc(collection(db, "expenses"), newExpense);
      setItems((prev) => [{ id: ref.id, ...newExpense }, ...prev]);
      setName("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setOpen(false);

      // 🔹 Hiển thị thông báo
      setToast("Bạn đã thêm một khoản chi mới!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Lỗi thêm:", err);
      alert("Thêm thất bại");
    }
  };

  return (
    <>
      {/* 🔹 Thông báo nổi */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in-out z-[9999]">
          {toast}
        </div>
      )}

      {/* 🔹 Nút mở popup */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          + Thêm khoản chi
        </button>
      </div>

      {/* 🔹 Popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              setOpen(false);
            }
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            ref={modalRef}
            className="relative bg-white w-11/12 max-w-md p-6 rounded-xl shadow-2xl z-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Thêm khoản chi</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Tên khoản chi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <input
                className="w-full border p-2 rounded text-left"
                placeholder="Số tiền"
                value={amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(raw)) setAmount(raw);
                }}
                inputMode="numeric"
              />

              {/* 🔹 Chọn ngày */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  Ngày chi:
                </span>

                {/* Nút chọn ngày */}
                <DatePicker
                  selected={new Date(date)}
                  onChange={(d) => setDate(d.toISOString().split("T")[0])}
                  locale={vi}
                  dateFormat="dd/MM/yyyy"
                  customInput={
                    <button
                      type="button"
                      className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2 shadow-sm transition"
                    >
                      📅 {new Date(date).toLocaleDateString("vi-VN")}
                    </button>
                  }
                />

                {/* Nút chọn hôm nay */}
                <button
                  type="button"
                  onClick={() => setDate(new Date().toISOString().split("T")[0])}
                  className="text-xs text-orange-600 hover:underline ml-1"
                >
                  Hôm nay
                </button>
              </div>


              {/* Hiển thị tháng / năm */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  Tháng Tiêu: {Number(selectedMonth) + 1} / {selectedYear}
                </div>
                <div className="italic">
                  Ngày Tạo: {new Date(date).toLocaleDateString("vi-VN")}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 rounded hover:brightness-110"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
