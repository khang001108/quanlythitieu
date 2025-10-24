// components/ExpenseMonth.js
import React from "react";

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
    <div className="bg-white p-4 rounded-xl shadow text-center space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">
        📅 Chọn tháng / năm
      </h2>

      <div className="flex justify-center gap-3">
        {/* Chọn tháng — cập nhật ngay khi thay đổi */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 w-40 text-center focus:ring-2 focus:ring-blue-400"
        >
          {monthNames.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

        {/* Chọn năm — cập nhật ngay khi thay đổi */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2 w-32 text-center focus:ring-2 focus:ring-blue-400"
        >
          {Array.from({ length: 6 }, (_, i) => currentYear - 1 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500">
        Dữ liệu sẽ cập nhật ngay khi bạn thay đổi tháng hoặc năm.
      </p>
    </div>
  );
}
