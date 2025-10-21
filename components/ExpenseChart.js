import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function ExpenseChart({ items }) {
  const monthlyData = {}

  items.forEach((item) => {
    const month = new Date(item.date).toLocaleString("vi-VN", { month: "short" })
    monthlyData[month] = (monthlyData[month] || 0) + item.amount
  })

  const data = Object.keys(monthlyData).map((m) => ({ month: m, amount: monthlyData[m] }))

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Thống kê theo tháng</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
