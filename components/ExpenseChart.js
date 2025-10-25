// components/ExpenseChart.js
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const monthNames = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

export default function ExpenseChart({ items = [], salary = {}, selectedYear }) {
  const [selected, setSelected] = useState(null);

  // 🔹 Tổng chi theo tháng
  const monthlyExpense = {};
  items.forEach((item) => {
    const month = Number(item.month ?? new Date(item.date).getMonth());
    const year = Number(item.year ?? new Date(item.date).getFullYear());
    if (year === Number(selectedYear))
      monthlyExpense[month] = (monthlyExpense[month] || 0) + Number(item.amount || 0);
  });

  // 🔹 Dữ liệu biểu đồ
  const data = Array.from({ length: 12 }, (_, i) => {
    const salaryVal = salary?.[String(selectedYear)]?.[String(i)] || 0;
    const expenseVal = monthlyExpense[i] || 0;
    return {
      month: monthNames[i],
      Chi: expenseVal,
      Lương: salaryVal,
      CònLại: salaryVal - expenseVal > 0 ? salaryVal - expenseVal : 0,
    };
  });

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
        📈 Biểu đồ tài chính năm {selectedYear}
      </h2>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
          >
            {/* Nền lưới */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* Trục */}
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4b5563" }} />
            <YAxis
              tickFormatter={(v) =>
                v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : v
              }
              tick={{ fontSize: 12, fill: "#4b5563" }}
            />

            {/* Hiệu ứng hover */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;

                // Màu tương ứng với từng loại
                const colorMap = {
                  "Chi": "#dc2626",
                  "Lương": "#16a34a",
                  "CònLại": "#ca8a04",
                };

                return (
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 text-sm">
                    <p className="font-semibold text-gray-800 mb-1">{label}</p>
                    {payload.map((entry, i) => (
                      <p key={i} style={{ color: colorMap[entry.name] || "#374151" }}>
                        <span className="font-medium">{entry.name}:</span>{" "}
                        {Number(entry.value).toLocaleString()}₫
                      </p>
                    ))}
                  </div>
                );
              }}
            />


            {/* Chú thích */}
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />

            {/* Gradient */}
            <defs>
              <linearGradient id="yellowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#fde047" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            {/* 🔹 Chi tiêu (Bar) */}
            <Bar dataKey="Chi" fill="url(#redGrad)" barSize={28} radius={[8, 8, 0, 0]} />

            {/* 🔹 Còn lại (Area) */}
            <Area
              type="monotone"
              dataKey="CònLại"
              fill="url(#yellowGrad)"
              stroke="#eab308"
              strokeWidth={2}
              dot={false}
            />

            {/* 🔹 Lương (Line) */}
            <Line
              type="monotone"
              dataKey="Lương"
              stroke="url(#greenGrad)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#16a34a" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-gray-500 mt-3 text-center">
        💡 Di chuột hoặc chạm để xem chi tiết từng tháng.
      </p>
    </div>
  );
}
