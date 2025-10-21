import { useState } from 'react'

export default function ExpenseForm({ setItems }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')

  const addItem = (e) => {
    e.preventDefault()
    if (!desc || !amount) return alert('Nhập đủ thông tin!')
    setItems(prev => [...prev, { id: Date.now(), desc, amount: Number(amount) }])
    setDesc('')
    setAmount('')
  }

  return (
    <form onSubmit={addItem} className="bg-white p-4 rounded-xl shadow mb-4">
      <div className="grid grid-cols-3 gap-2">
        <input
          className="col-span-2 border p-2 rounded"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Nội dung chi tiêu kkk"
        />
        <input
          className="border p-2 rounded"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Số tiền"
          type="number"
        />
      </div>
      <div className="mt-3 text-right">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Thêm</button>
      </div>
    </form>
  )
}
