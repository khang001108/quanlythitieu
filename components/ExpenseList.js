// components/ExpenseList.js
import { useEffect, useState } from "react";
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
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    console.log("📅 Load dữ liệu tháng:", selectedMonth, "năm:", selectedYear);

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      where("month", "==", Number(selectedMonth)),
      where("year", "==", Number(selectedYear)),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const docData = d.data();
        return {
          id: d.id,
          name: docData.name || "",
          amount: Number(docData.amount || 0),
          date: docData.date || (docData.createdAt ? docData.createdAt.toDate().toISOString() : ""),
          month: docData.month,
          year: docData.year,
        };
      });

      console.log("📊 Dữ liệu nhận được:", data);
      setItems(data);
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

  const displayList = showAll ? items : items.slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Danh sách chi tiêu tháng {selectedMonth + 1}/{selectedYear}</h2>

      {displayList.map(item => {
        const isExpanded = expandedId === item.id;
        return (
          <div key={item.id} className="flex justify-between border-b py-2">
            <div>
              <p className="font-medium">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">
                {isExpanded ? `Ngày: ${fmt(item.date)}` : `Ngày: ${new Date(item.date).toLocaleDateString("vi-VN")}`}
              </p>

              {isExpanded && (
                <div className="text-sm text-gray-600 mt-2">
                  <div>Chi tiết thêm: {/* placeholder nếu muốn mở rộng */} </div>
                  <div className="mt-1">Tháng: {item.month + 1} / {item.year}</div>
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-red-500 font-semibold">{Number(item.amount).toLocaleString()}₫</p>

              <div className="flex flex-col items-end gap-1 mt-1">
                <button
                  onClick={() => setExpandedId(prev => prev === item.id ? null : item.id)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {isExpanded ? "Thu gọn" : "Mở rộng"}
                </button>
                <button onClick={() => remove(item.id)} className="text-sm text-gray-400 hover:text-red-600">Xóa</button>
              </div>
            </div>
          </div>
        );
      })}

      {items.length > 3 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            {showAll ? "Thu gọn" : `Xem thêm (${items.length - 3} khoản còn lại)`}
          </button>
        </div>
      )}
    </div>
  );
                  }
