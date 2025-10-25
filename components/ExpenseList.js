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
import { CalendarDays, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";

export default function ExpenseList({
  user,
  items,
  setItems,
  selectedMonth,
  selectedYear,
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortType, setSortType] = useState("newest");
  const [searchDate, setSearchDate] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Lấy dữ liệu tháng
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

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const docData = d.data();
        return {
          id: d.id,
          name: docData.name || "",
          amount: Number(String(docData.amount).replace(/,/g, "")) || 0,
          date: docData.date || "",
          month: docData.month ?? null,
          year: docData.year ?? null,
          createdAt: docData.createdAt
            ? docData.createdAt.toDate()
            : new Date(docData.date),
        };
      });
      setItems(data);
    });

    return () => unsub();
  }, [user, selectedMonth, selectedYear, setItems]);

  // 🧭 Lọc theo ngày được chọn
  const filteredItems = useMemo(() => {
    if (!searchDate) return items;
    const target = new Date(searchDate).toISOString().split("T")[0];
    return items.filter((i) => i.date?.startsWith(target));
  }, [items, searchDate]);

  // 🔹 Sắp xếp
  const sortedItems = useMemo(() => {
    const copy = [...filteredItems];
    switch (sortType) {
      case "high":
        return copy.sort((a, b) => b.amount - a.amount);
      case "low":
        return copy.sort((a, b) => a.amount - b.amount);
      case "oldest":
        return copy.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return copy.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  }, [filteredItems, sortType]);

  const remove = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    await deleteDoc(doc(db, "expenses", id));
  };

  return (
    <>
      <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            📋 Chi tiêu tháng {selectedMonth + 1}/{selectedYear}
          </h2>

          <div className="flex items-center gap-2">
            {/* 🔸 Nút mở lịch */}
            <button
              onClick={() => setOpenCalendar(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-lg shadow hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              <CalendarDays className="w-4 h-4" /> Ngày
            </button>

            {/* 🔸 Sắp xếp */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border rounded-lg text-sm p-2 focus:ring-2 focus:ring-orange-400"
            >
              <option value="newest">🕒 Mới nhất</option>
              <option value="oldest">🕓 Cũ nhất</option>
              <option value="high">💸 Tiêu nhiều</option>
              <option value="low">💰 Tiêu ít</option>
            </select>
          </div>
        </div>

        {/* Danh sách */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">
            Đang tải dữ liệu...
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            Không có khoản chi nào.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto pr-1 divide-y">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-3 items-start hover:bg-orange-50 rounded-lg transition"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-none">🏷</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      📅 {new Date(item.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
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
                      className="text-sm text-gray-400 hover:text-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tổng kết */}
        <div className="mt-4 text-center text-sm text-gray-600 font-medium">
          🧾 Tổng: {sortedItems.length} khoản chi
        </div>
      </div>

      {/* 📅 Popup lịch Việt Nam */}
      {openCalendar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpenCalendar(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Chọn ngày cần lọc
            </h3>
            <DatePicker
              selected={searchDate}
              onChange={(date) => setSearchDate(date)}
              inline
              locale={vi}
              dateFormat="dd/MM/yyyy"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSearchDate(null)}
                className="border px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Xóa lọc
              </button>
              <button
                onClick={() => setOpenCalendar(false)}
                className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:brightness-110"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup chi tiết */}
      {selectedItem && (
        <ExpenseDetailPopup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}

// Popup chi tiết
function ExpenseDetailPopup({ item, onClose }) {
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
        className="relative bg-white w-11/12 max-w-md p-6 rounded-2xl shadow-2xl z-10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Chi tiết khoản chi
        </h3>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Tên:</span> {item.name}
          </p>
          <p>
            <span className="font-semibold">Số tiền:</span>{" "}
            {Number(item.amount).toLocaleString()}₫
          </p>
          <p>
            <span className="font-semibold">Ngày Chi:</span>{" "}
            {new Date(item.date).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <span className="font-semibold">Tháng/Năm Tạo:</span>{" "}
            {(item.month ?? 0) + 1} / {item.year ?? "?"}
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:brightness-110"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
