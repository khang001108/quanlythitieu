// components/ExpenseList.js
import { useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ExpenseList({ user, items, setItems, selectedMonth, selectedYear }) {
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    // build query: only expenses of this user + month + year
    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      where("month", "==", selectedMonth),
      where("year", "==", selectedYear),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(d => {
        const docData = d.data();
        // normalize amount and date
        return {
          id: d.id,
          name: docData.name || "",
          amount: Number(docData.amount || 0),
          date: docData.date || (docData.createdAt ? docData.createdAt.toDate().toISOString() : ""),
          month: docData.month,
          year: docData.year
        };
      });
      setItems(data);
    }, err => {
      console.error("Snapshot lỗi:", err);
      setItems([]);
    });

    return () => unsub();
  }, [user, selectedMonth, selectedYear, setItems]);

  const remove = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
      // onSnapshot sẽ cập nhật UI tự động
    } catch (err) {
      console.error("Xóa lỗi:", err);
      alert("Xóa thất bại");
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">
        Chưa có khoản chi nào trong tháng {selectedMonth + 1}/{selectedYear}
      </div>
    );
  }

  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("vi-VN") + " " + d.toLocaleDateString("vi-VN");
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Danh sách chi tiêu tháng {selectedMonth + 1}/{selectedYear}</h2>
      {items.map(item => (
        <div key={item.id} className="flex justify-between border-b py-2">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">Ngày: {fmt(item.date)}</p>
          </div>
          <div className="text-right">
            <p className="text-red-500 font-semibold">{Number(item.amount).toLocaleString()}₫</p>
            <button onClick={() => remove(item.id)} className="text-sm text-gray-400 hover:text-red-600">Xóa</button>
          </div>
        </div>
      ))}
    </div>
  );
}
