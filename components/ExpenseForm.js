// components/ExpenseForm.js
import { useState, useRef, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ExpenseForm({
  user,
  setItems,
  selectedMonth,
  selectedYear,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const modalRef = useRef();

  // close when clicking outside modal content
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
      date: new Date().toISOString(),
      month: Number(selectedMonth),
      year: Number(selectedYear),
      createdAt: serverTimestamp(),
    };

    try {
      const ref = await addDoc(collection(db, "expenses"), newExpense);
      // optimistic update: add to UI
      setItems((prev) => [{ id: ref.id, ...newExpense }, ...prev]);
      setName("");
      setAmount("");
      setOpen(false);
    } catch (err) {
      console.error("Lỗi thêm:", err);
      alert("Thêm thất bại");
    }
  };

  return (
    <>
      {/* 🔹 Nút mở popup */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 text-white px-8 py-2 rounded-full shadow hover:brightness-105 transition"
        >
          + Thêm khoản chi
        </button>
      </div>


      {/* 🔹 Popup */}
      {open && (
        // backdrop
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            // click outside modal content closes it
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
                  const raw = e.target.value.replace(/,/g, ""); // bỏ dấu phẩy
                  if (/^\d*$/.test(raw)) setAmount(raw); // chỉ nhận ký tự số
                }}
                inputMode="numeric"
              />

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  Tháng: {Number(selectedMonth) + 1} / {selectedYear}
                </div>
                <div className="italic">
                  Ngày: {new Date().toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 rounded"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 bg-gray-200 py-2 rounded"
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
