import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ExpenseForm({ setItems, user, selectedMonth, selectedYear }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !user) return;

    const dateObj = new Date();
    // nếu cần, dùng selectedMonth & selectedYear để gán tháng/năm cụ thể
    const month = selectedMonth !== undefined ? selectedMonth : dateObj.getMonth();
    const year = selectedYear !== undefined ? selectedYear : dateObj.getFullYear();

    try {
      const newExpense = {
        name,
        amount: Number(amount),
        date: new Date(year, month, dateObj.getDate()).toISOString(),
        month,
        year,
        userId: user.uid,
      };

      await addDoc(collection(db, "expenses"), {
        ...newExpense,
        createdAt: serverTimestamp(),
      });

      setName("");
      setAmount("");
    } catch (err) {
      console.error("Thêm chi tiêu thất bại:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Nội dung chi tiêu"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2"
        required
      />
      <input
        type="number"
        placeholder="Số tiền"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded p-2"
        required
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
        >
          ✒Thêm
        </button>
      </div>
    </form>
  );
}
