// components/ExpenseChart.js
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const monthNames = [
  "Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"
];

export default function ExpenseChart({ items, salary }) {
  // 🔹 Tổng chi theo tháng
  const monthlyExpense = {};
  items.forEach(item => {
    const date = new Date(item.date);
    if (isNaN(date)) return;
    const month = date.getMonth();
    monthlyExpense[month] = (monthlyExpense[month] || 0) + Number(item.amount || 0);
  });

  // 🔹 Dữ liệu biểu đồ
  const data = Array.from({ length: 12 }, (_, i) => {
    const s = salary[String(new Date().getFullYear())]?.[String(i)] || 0;
    const e = monthlyExpense[i] || 0;
    return {
      month: monthNames[i],
      Chi: e,
      Lương: s,
      "Còn lại": s - e > 0 ? s - e : 0,
    };
  });

  // 🔹 Cột Tổng
  const totalSalary = Object.values(salary[String(new Date().getFullYear())] || {}).reduce((a, b) => a + b, 0);
  const totalExpense = Object.values(monthlyExpense).reduce((a, b) => a + b, 0);
  data.push({
    month: "Tổng",
    Chi: totalExpense,
    Lương: totalSalary,
    "Còn lại": totalSalary - totalExpense > 0 ? totalSalary - totalExpense : 0,
  });

  // 🔹 Tooltip formatter
  const tooltipFormatter = (value) => `${value.toLocaleString()}₫`;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
        📈 Biểu đồ Lương - Chi - Còn lại
      </h2>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />

          {/* Cột Lương */}
          <Bar dataKey="Lương" fill="#4ade80" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="Lương" position="top" formatter={(v) => v ? v.toLocaleString() + "₫" : ""} fontSize={10} />
          </Bar>

          {/* Cột Chi */}
          <Bar dataKey="Chi" fill="#f87171" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="Chi" position="top" formatter={(v) => v ? v.toLocaleString() + "₫" : ""} fontSize={10} />
          </Bar>

          {/* Cột Còn lại */}
          <Bar dataKey="Còn lại" fill="#facc15" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="Còn lại" position="top" formatter={(v) => v ? v.toLocaleString() + "₫" : ""} fontSize={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 mt-3 text-center">
        💡 Mỗi cột thể hiện tổng <span className="text-green-600">lương</span>,{" "}
        <span className="text-red-500">chi tiêu</span> và{" "}
        <span className="text-yellow-500">số dư</span> của từng tháng.
      </p>
    </div>
  );
}
