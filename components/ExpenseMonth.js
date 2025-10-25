// components/ExpenseMonth.js
import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react";

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function ExpenseMonth({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef();
  const currentYear = new Date().getFullYear();

  // Đóng popup bằng phím Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          <CalendarDays className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Tháng/Năm</span>
        </button>
      </div>

      {/* 🔹 Popup */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e) => {
            // click ngoài đóng popup
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              setOpen(false);
            }
          }}
        >
          {/* Nền mờ */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Hộp chọn tháng/năm */}
          <div
            ref={modalRef}
            className="relative bg-white w-11/12 max-w-md p-6 rounded-xl shadow-2xl z-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Chọn tháng / năm
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Form chọn */}
            <div className="flex flex-wrap justify-center gap-5">
              {/* Chọn tháng */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-500 mb-1">Tháng</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer bg-gray-50 hover:bg-white"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn năm */}
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-500 mb-1">Năm</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer bg-gray-50 hover:bg-white"
                >
                  {Array.from({ length: 6 }, (_, i) => currentYear - 1 + i).map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4 italic">
              Dữ liệu sẽ tự động cập nhật khi bạn thay đổi tháng hoặc năm.
            </p>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
