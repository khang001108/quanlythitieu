export default function ExpenseList({ items, setItems }) {
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  if (!items || items.length === 0)
    return <div className="bg-white p-4 rounded-xl shadow text-center text-gray-500">Chưa có khoản chi nào</div>

  const formatDate = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN")
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Danh sách chi tiêu</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between border-b py-2">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">Ngày: {formatDate(item.date)}</p>
          </div>
          <div className="text-right">
            <p className="text-red-500 font-semibold">{item.amount.toLocaleString()}₫</p>
            <button
              onClick={() => remove(item.id)}
              className="text-sm text-gray-400 hover:text-red-600"
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
