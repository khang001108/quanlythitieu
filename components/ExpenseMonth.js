// components/ExpenseMonth.js
import React from "react";
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
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <CalendarDays className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Chọn tháng / năm
        </h2>
      </div>

      {/* Bộ chọn tháng - năm */}
      <div className="flex flex-wrap justify-center gap-4">
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

        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-500 mb-1">Năm</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer bg-gray-50 hover:bg-white"
          >
            {Array.from({ length: 6 }, (_, i) => currentYear - 1 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ghi chú */}
      <p className="text-xs text-gray-500 text-center mt-4 italic">
        Dữ liệu sẽ tự động cập nhật khi bạn thay đổi tháng hoặc năm.
      </p>
    </div>
  );
}
