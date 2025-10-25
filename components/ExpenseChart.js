// components/ExpenseChart.js
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";

const monthNames = [
  "Th1",
  "Th2",
  "Th3",
  "Th4",
  "Th5",
  "Th6",
  "Th7",
  "Th8",
  "Th9",
  "Th10",
  "Th11",
  "Th12",
];

export default function ExpenseChart({
  items = [],
  salary = {},
  selectedYear,
}) {
  const [selected, setSelected] = useState(null); // popup state
  const currentYear = selectedYear; // 🔹 dùng năm được chọn

  // 🔹 Tổng chi theo tháng
  const monthlyExpense = {};
  items.forEach((item) => {
    const date = new Date(item.date);
    if (isNaN(date)) return;
    const month = date.getMonth();
    monthlyExpense[month] =
      (monthlyExpense[month] || 0) + Number(item.amount || 0);
  });

  // 🔹 Dữ liệu biểu đồ
  const data = Array.from({ length: 12 }, (_, i) => {
    const s = salary[String(currentYear)]?.[String(i)] || 0;
    const e = monthlyExpense[i] || 0;
    return {
      month: monthNames[i],
      Chi: e,
      Lương: s,
      "Còn lại": s - e > 0 ? s - e : 0,
    };
  });

  // 🔹 Cột Tổng năm
  const totalSalary = Object.values(salary[String(currentYear)] || {}).reduce(
    (a, b) => a + b,
    0
  );
  const totalExpense = Object.values(monthlyExpense).reduce((a, b) => a + b, 0);
  data.push({
    month: "Tổng🚩",
    Chi: totalExpense,
    Lương: totalSalary,
    "Còn lại": totalSalary - totalExpense > 0 ? totalSalary - totalExpense : 0,
  });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 relative">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
        📊 Biểu đồ chi tiêu & lương năm {currentYear}
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
          barGap={6}
          barCategoryGap="25%"
        >
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) =>
              v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v
            }
          />
          <Legend iconType="circle" />

          {/* 🔹 Cột Lương (click để xem popup) */}
          <Bar
            dataKey="Lương"
            fill="#16a34a"
            barSize={35}
            radius={[5, 5, 0, 0]}
            onClick={(d) => setSelected({ ...d, type: "Lương" })}
          />

          {/* 🔹 Cột Chi */}
          <Bar
            dataKey="Chi"
            fill="#dc2626"
            barSize={35}
            radius={[5, 5, 0, 0]}
            onClick={(d) => setSelected({ ...d, type: "Chi tiêu" })}
          />

          {/* 🔹 Cột Còn lại */}
          <Bar
            dataKey="Còn lại"
            fill="#facc15"
            barSize={25}
            radius={[5, 5, 0, 0]}
            onClick={(d) => setSelected({ ...d, type: "Còn lại" })}
          />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 mt-3 text-center">
        🔍 Chạm vào cột để xem chi tiết lương, chi tiêu và số dư từng tháng.
      </p>

      {/* 🔹 Popup hiển thị thông tin chi tiết */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-2xl w-80 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              {selected.month} - Chi tiết
            </h3>
            <p className="text-gray-600">
              💰 Lương: {selected["Lương"].toLocaleString()}₫
            </p>
            <p className="text-gray-600">
              💸 Chi tiêu: {selected["Chi"].toLocaleString()}₫
            </p>
            <p
              className={`text-lg font-bold mt-2 ${
                selected["Còn lại"] < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              Còn lại: {selected["Còn lại"].toLocaleString()}₫
            </p>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
