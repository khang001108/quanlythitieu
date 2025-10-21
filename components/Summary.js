export default function Summary({ items }) {
  const total = (items || []).reduce((s, i) => s + (i.amount || 0), 0)
  return (
    <div className="bg-green-50 p-4 rounded-xl text-center font-bold">
      Tổng chi: {total.toLocaleString()} đ
    </div>
  )
}
