export default function ExpenseList({ items, setItems }) {
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))
  if (!items || items.length === 0) return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 text-center text-gray-500">Chưa có khoản chi nào</div>
  )
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">
      {items.map(i => (
        <div key={i.id} className="flex items-center justify-between border-b py-2">
          <div>
            <div className="font-semibold">{i.desc}</div>
            <div className="text-sm text-gray-500">ID: {i.id}</div>
            <div className="text-sm text-gray-500">Ngày: {new Date().toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-bold">{i.amount.toLocaleString()} đ</div>
            <button onClick={() => remove(i.id)} className="text-red-500">Xóa</button>
          </div>
        </div>
      ))}
    </div>
  )
}
