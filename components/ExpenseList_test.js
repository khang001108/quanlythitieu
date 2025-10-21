// components/ExpenseList.js
import { useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function ExpenseList({ items, setItems, user }) {
  // 🔹 Lấy dữ liệu realtime từ Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        amount: Number(doc.data().amount || 0),
      }));
      setItems(data);
    });

    return () => unsubscribe();
  }, [user, setItems]);

  // 🔹 Xóa chi tiêu
  const remove = async (id) => {
    if (!id) return;
    if (confirm("Bạn có chắc muốn xóa khoản này không?")) {
      try {
        // ✅ Cập nhật UI ngay
        setItems((prev) => prev.filter((item) => item.id !== id));

        // ✅ Xóa database
        await deleteDoc(doc(db, "expenses", id));
      } catch (err) {
        console.error("Xóa thất bại:", err);
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">
        Chưa có khoản chi nào
      </div>
    );
  }

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Không xác định";
    return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Danh sách chi tiêu</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between border-b py-2">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">Ngày: {formatDate(item.date)}</p>
          </div>
          <div className="text-right">
            <p className="text-red-500 font-semibold">
              {Number(item.amount).toLocaleString()}₫
            </p>
            <button
              onClick={() => remove(item.id)}
              className="text-sm text-gray-400 hover:text-red-600"
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
