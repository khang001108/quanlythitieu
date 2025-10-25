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
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

// 🐭 Mảng 12 con giáp tương ứng với 12 tháng
const zodiacAnimals = [
  "🐀", // Tháng 1 - Tý
  "🐂", // Tháng 2 - Sửu
  "🐅", // Tháng 3 - Dần
  "🐇", // Tháng 4 - Mão
  "🐉", // Tháng 5 - Thìn
  "🐍", // Tháng 6 - Tỵ
  "🐎", // Tháng 7 - Ngọ
  "🐐", // Tháng 8 - Mùi
  "🐒", // Tháng 9 - Thân
  "🐓", // Tháng 10 - Dậu
  "🐕", // Tháng 11 - Tuất
  "🐖", // Tháng 12 - Hợi
];

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

  // 🔹 Lấy dữ liệu Firestore theo tháng/năm
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
    const target = searchDate.toLocaleDateString("en-CA");
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
    if (!confirm("Bạn có chắc muốn xóa khoản chi này?")) return;
    await deleteDoc(doc(db, "expenses", id));
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-3">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {zodiacAnimals[selectedMonth]} 📋 Chi tiêu tháng {selectedMonth + 1}/
            {selectedYear}
          </h2>

          <div className="flex items-center gap-2">
            {/* 🔸 Nút mở lịch */}
            <button
              onClick={() => setOpenCalendar(true)}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl shadow hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              <CalendarDays className="w-4 h-4" /> Ngày
            </button>

            {/* 🔸 Sắp xếp */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border rounded-xl text-sm px-3 py-2 focus:ring-2 focus:ring-orange-400"
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
          <div className="w-full max-h-80 overflow-y-auto pr-2">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex justify-between items-center p-4 mb-3 bg-gradient-to-r from-white to-orange-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200"
              >
                {/* Thanh màu nhỏ bên trái */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 to-orange-600 rounded-l-2xl" />

                {/* Thông tin chính */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 text-xl shadow-inner">
                    💸
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-base leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(item.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Giá trị + nút */}
                <div className="text-right">
                  <p className="text-lg font-bold text-red-500">
                    {Number(item.amount).toLocaleString()}₫
                  </p>
                  <div className="flex items-center justify-end gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-sm text-blue-500 hover:text-blue-700 transition"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm text-gray-400 hover:text-red-500 transition"
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
        <div className="mt-5 text-center text-sm text-gray-600 font-medium">
          🧾 Tổng: {sortedItems.length} khoản chi
        </div>
      </div>

      {/* 📅 Popup lịch */}
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

// 📌 Popup chi tiết khoản chi
function ExpenseDetailPopup({ item, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
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
        className="relative bg-orange-100 w-11/12 max-w-md p-6 rounded-2xl shadow-2xl z-10"
      >
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Chi tiết khoản chi
        </h3>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">🏷 Tên:</span> {item.name}
          </p>
          <p>
            <span className="font-semibold">💰 Số tiền:</span>{" "}
            {Number(item.amount).toLocaleString()}₫
          </p>
          <p>
            <span className="font-semibold">📅 Ngày chi:</span>{" "}
            {new Date(item.date).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <span className="font-semibold">🗓 Tháng/Năm:</span>{" "}
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
