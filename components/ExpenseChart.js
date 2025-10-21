import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function ExpenseChart({ items }) {
  // 🔹 Tạo dữ liệu theo tháng
  const monthlyData = {};

  items.forEach((item) => {
    const date = new Date(item.date);
    if (isNaN(date)) return;
    const month = date.getMonth(); // 0-11
    monthlyData[month] = (monthlyData[month] || 0) + Number(item.amount || 0);
  });

  // 🔹 Chuyển thành mảng, sắp xếp tháng 0→11
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: monthNames[i],
    amount: monthlyData[i] || 0,
  }));

  // 🔹 Format tooltip
  const tooltipFormatter = (value) => `${value.toLocaleString()}₫`;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Thống kê chi tiêu theo tháng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => value.toLocaleString()} />
          <Tooltip formatter={tooltipFormatter} />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="amount"
              position="top"
              formatter={(value) => (value > 0 ? value.toLocaleString() + "₫" : "")}
              style={{ fontSize: 12, fontWeight: "bold", fill: "#1e3a8a" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
