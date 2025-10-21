import { useState, useEffect } from "react"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import Summary from "../components/Summary"
import ExpenseChart from "../components/ExpenseChart"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {
  const [items, setItems] = useState([])
  const [salary, setSalary] = useState(0)
  const [user, setUser] = useState(null);

  // 🔹 Đọc dữ liệu từ LocalStorage khi load trang
  useEffect(() => {
    const saved = localStorage.getItem("expenses")
    const savedSalary = localStorage.getItem("salary")
    if (saved) setItems(JSON.parse(saved))
    if (savedSalary) setSalary(Number(savedSalary))
  }, [])

  // 🔹 Lưu dữ liệu khi có thay đổi
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(items))
    localStorage.setItem("salary", salary)
  }, [items, salary])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Quản Lý Chi Tiêu
      </h1>
      <div className="bg-white p-4 rounded-xl shadow">
        <label className="block text-gray-700 font-semibold mb-1">Lương tháng:</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          placeholder="Nhập lương tháng..."
          className="w-full border rounded-lg p-2"
        />
      </div>
      <ExpenseForm setItems={setItems} />
      <ExpenseList items={items} setItems={setItems} />
      <Summary items={items} salary={salary} />
      <ExpenseChart items={items} />
    </div>
  )
}
