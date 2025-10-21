import { useState } from "react"

export default function ExpenseForm({ setItems }) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")

  const submit = (e) => {
    e.preventDefault()
    if (!name || !amount) return
    const newExpense = {
      id: Date.now(),
      name,
      amount: Number(amount),
      date: new Date().toISOString(), // 🔹 thêm ngày giờ
    }
    setItems(prev => [...prev, newExpense])
    setName("")
    setAmount("")
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-xl shadow space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nội dung chi tiêu"
        className="w-full border p-2 rounded-lg"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Số tiền"
        className="w-full border p-2 rounded-lg"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Thêm
      </button>
    </form>
  )
}
