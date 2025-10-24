import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function ExpenseChart({ items = [], salary = {}, selectedYear }) {
  // 🔹 Chi tiêu từng tháng
  const monthlyExpense = {};
  items.forEach((item) => {
    const date = new Date(item.date);
    if (isNaN(date)) return;
    const m = date.getMonth();
    monthlyExpense[m] = (monthlyExpense[m] || 0) + Number(item.amount || 0);
  });

  // 🔹 Lương năm hiện tại
  const yearData = salary[String(selectedYear)] || {};

  // 🔹 Chuẩn bị dữ liệu cho biểu đồ
  const data = Array.from({ length: 12 }, (_, i) => {
    const s = Number(yearData[String(i)] || 0);
    const e = Number(monthlyExpense[i] || 0);
    return {
      month: monthNames[i],
      expense: e,
      salary: s,
      remain: s - e,
    };
  });

  // 🔹 Tổng cả năm
  const totalSalary = Object.values(yearData).reduce((a, b) => a + Number(b || 0), 0);
  const totalExpense = Object.values(monthlyExpense).reduce((a, b) => a + Number(b || 0), 0);
  data.push({
    month: "Total",
    expense: totalExpense,
    salary: totalSalary,
    remain: totalSalary - totalExpense,
  });

  const tooltipFormatter = (value) => `${value.toLocaleString()}₫`;
  const maxY = Math.max(...data.map((d) => Math.max(d.salary, d.expense)), 5000000);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold mb-2">📊 Biểu đồ lương & chi tiêu {selectedYear}</h2>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            domain={[0, maxY]}
          />
          <Tooltip formatter={tooltipFormatter} />

          <Bar dataKey="salary" fill="#10b981" barSize={30}>
            <LabelList
              dataKey="salary"
              position="top"
              formatter={(v) => (v > 0 ? v.toLocaleString() + "₫" : "")}
            />
          </Bar>
          <Bar dataKey="expense" fill="#ef4444" barSize={30}>
            <LabelList
              dataKey="expense"
              position="top"
              formatter={(v) => (v > 0 ? v.toLocaleString() + "₫" : "")}
            />
          </Bar>
          <Bar dataKey="remain" fill="#facc15" barSize={20}>
            <LabelList
              dataKey="remain"
              position="insideTop"
              formatter={(v) => (v > 0 ? v.toLocaleString() + "₫" : "")}
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      <div className="text-gray-500 text-sm mt-3 text-center">
        Trục Y hiển thị theo triệu đồng (M₫)
      </div>
    </div>
  );
}
