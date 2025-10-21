import { useState, useEffect } from 'react'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import Summary from '../components/Summary'

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(items))
  }, [items])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý chi tiêu trong tháng</h1>
      <div className="w-full max-w-2xl">
        <ExpenseForm setItems={setItems} />
        <ExpenseList items={items} setItems={setItems} />
        <Summary items={items} />
      </div>
    </div>
  )
}
