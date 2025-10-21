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
import { db, auth } from "../lib/firebase";

export default function ExpenseList({ items, setItems }) {
  // 🔹 Lắng nghe dữ liệu theo user hiện tại từ Firestore
  useEffect(() => {
    const user = auth.currentUser;
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
        amount: Number(doc.data().amount || 0), // chắc chắn là number
      }));
      setItems(data);
    });

    return () => unsubscribe();
  }, [setItems]);

  // 🔹 Xóa chi tiêu: xóa state + database
  const remove = async (id) => {
    if (!id) return;
    if (confirm("Bạn có chắc muốn xóa khoản này không?")) {
      try {
        // Xóa cache UI ngay
        setItems((prev) => prev.filter((item) => item.id !== id));

        // Xóa Firestore
        await deleteDoc(doc(db, "expenses", id));
      } catch (error) {
        console.error("Xóa thất bại:", error);
      }
    }
  };

  if (!items || items.length === 0)
    return (
      <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">
        Chưa có khoản chi nào
      </div>
    );

  // 🔹 Format ngày, tránh lỗi
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Không xác định";
    return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN");
  };

  // 🔹 Tính tổng tiền
  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Danh sách chi tiêu</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between border-b py-2">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">
              Ngày: {formatDate(item.date)}
            </p>
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

      {/* Tổng tiền */}
      <div className="text-right mt-4 font-bold text-lg">
        Tổng: {totalAmount.toLocaleString()}₫
      </div>
    </div>
  );
}
