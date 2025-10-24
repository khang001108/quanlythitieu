// components/ExpenseForm.js
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ExpenseForm({ user, setItems, selectedMonth, selectedYear }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập");
    if (!name || !amount) return alert("Nhập đầy đủ thông tin");

    const newExpense = {
      userId: user.uid,
      name,
      amount: Number(amount),
      date: new Date().toISOString(),
      month: selectedMonth,
      year: selectedYear,
      createdAt: serverTimestamp()
    };

    try {
      const ref = await addDoc(collection(db, "expenses"), newExpense);
      // optimistic update: add temporary item to UI (id = ref.id)
      setItems(prev => [{ id: ref.id, ...newExpense }, ...prev]);
      setName("");
      setAmount("");
    } catch (err) {
      console.error("Lỗi thêm:", err);
      alert("Thêm thất bại");
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-xl shadow space-y-3">
      <input className="w-full border p-2 rounded" placeholder="Tên khoản chi" value={name} onChange={e => setName(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="Số tiền" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
      <button className="w-full bg-blue-500 text-white py-2 rounded">Thêm</button>
    </form>
  );
}
