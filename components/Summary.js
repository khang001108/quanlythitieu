export default function Summary({ items, salary }) {
  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const remaining = salary - total

  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-lg font-semibold">Tổng chi: {total.toLocaleString()}₫</p>
      <p className={`text-lg font-semibold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>
        Còn lại: {remaining.toLocaleString()}₫
      </p>
    </div>
  )
}
