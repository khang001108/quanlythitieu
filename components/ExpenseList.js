// components/ExpenseList.js
import { useEffect, useState, useRef, useMemo } from "react";
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

export default function ExpenseList({
  user,
  items,
  setItems,
  selectedMonth,
  selectedYear,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortType, setSortType] = useState("newest"); // sắp xếp mặc định: mới nhất

  useEffect(() => {
    if (!user || selectedMonth == null || selectedYear == null) {
      setItems([]);
      return;
    }

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      where("month", "==", Number(selectedMonth)),
      where("year", "==", Number(selectedYear)),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const docData = d.data();
          return {
            id: d.id,
            name: docData.name || "",
            amount: Number(String(docData.amount).replace(/,/g, "")) || 0,
            date:
              docData.date ||
              (docData.createdAt
                ? docData.createdAt.toDate().toISOString()
                : ""),
            month: docData.month ?? null,
            year: docData.year ?? null,
            createdAt: docData.createdAt
              ? docData.createdAt.toDate()
              : new Date(docData.date),
          };
        });
        setItems(data);
      },
      (err) => {
        console.error("🔥 Lỗi query:", err);
        setItems([]);
      }
    );

    return () => unsub();
  }, [user, selectedMonth, selectedYear, setItems]);

  // 🗑️ Xóa chi tiêu
  const remove = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (err) {
      console.error("Xóa lỗi:", err);
      alert("Xóa thất bại");
    }
  };

  // 📅 Định dạng ngày
  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      return (
        d.toLocaleTimeString("vi-VN") + " " + d.toLocaleDateString("vi-VN")
      );
    } catch {
      return iso;
    }
  };

  // 🔹 Sắp xếp danh sách theo lựa chọn
  const sortedItems = useMemo(() => {
    const copy = [...items];
    switch (sortType) {
      case "high":
        return copy.sort((a, b) => b.amount - a.amount); // tiêu nhiều → ít
      case "low":
        return copy.sort((a, b) => a.amount - b.amount); // tiêu ít → nhiều
      case "oldest":
        return copy.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "newest":
      default:
        return copy.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  }, [items, sortType]);

  if (!items || items.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">
        Chưa có khoản chi nào trong tháng {selectedMonth + 1}/{selectedYear}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow">
        {/* Tiêu đề + bộ lọc sắp xếp */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">
            Danh sách chi tiêu tháng {selectedMonth + 1}/{selectedYear}
          </h2>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border rounded-lg text-sm p-1"
          >
            <option value="newest">🕒 Mới nhất → Cũ nhất</option>
            <option value="oldest">🕓 Cũ nhất → Mới nhất</option>
            <option value="high">💸 Tiêu nhiều → Ít</option>
            <option value="low">💰 Tiêu ít → Nhiều</option>
          </select>
        </div>

        {/* Danh sách cuộn */}
        <div className="max-h-64 overflow-y-auto pr-1">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b py-2 items-start"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Ngày cập nhật:{" "}
                  {new Date(item.date).toLocaleDateString("vi-VN")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-red-500 font-semibold">
                  {Number(item.amount).toLocaleString()}₫
                </p>

                <div className="flex flex-col items-end gap-1 mt-1">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-sm text-gray-400 hover:text-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng số khoản chi */}
        <div className="mt-3 text-center text-sm text-gray-600 font-medium">
          🧾 Tổng: {items.length} khoản chi trong tháng {selectedMonth + 1}/
          {selectedYear}
        </div>
      </div>

      {/* Popup chi tiết khoản chi */}
      {selectedItem && (
        <ExpenseDetailPopup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          fmt={fmt}
        />
      )}
    </>
  );
}

// 🔹 Popup hiển thị chi tiết khoản chi
function ExpenseDetailPopup({ item, onClose, fmt }) {
  const modalRef = useRef();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative bg-white w-11/12 max-w-md p-6 rounded-xl shadow-2xl z-10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">Chi tiết khoản chi</h3>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Tên:</span> {item.name}
          </p>
          <p>
            <span className="font-semibold">Số tiền:</span>{" "}
            {Number(item.amount).toLocaleString()}₫
          </p>
          <p>
            <span className="font-semibold">Ngày tạo:</span> {fmt(item.date)}
          </p>
          <p>
            <span className="font-semibold">Tháng/Năm:</span>{" "}
            {(item.month ?? 0) + 1} / {item.year ?? "?"}
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
