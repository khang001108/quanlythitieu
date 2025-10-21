import { useState, useEffect } from "react"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import Summary from "../components/Summary"
import ExpenseChart from "../components/ExpenseChart"
import { auth } from "../lib/firebase"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth"

export default function Home() {
  const [items, setItems] = useState([])
  const [salary, setSalary] = useState(0)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")

  // 🔹 Kiểm tra trạng thái đăng nhập Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // 🔹 Đọc dữ liệu từ LocalStorage khi load
  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(`expenses_${user.uid}`)
    const savedSalary = localStorage.getItem(`salary_${user.uid}`)
    if (saved) setItems(JSON.parse(saved))
    if (savedSalary) setSalary(Number(savedSalary))
  }, [user])

  // 🔹 Lưu dữ liệu khi có thay đổi
  useEffect(() => {
    if (!user) return
    localStorage.setItem(`expenses_${user.uid}`, JSON.stringify(items))
    localStorage.setItem(`salary_${user.uid}`, salary)
  }, [items, salary, user])

  // 🔹 Xử lý đăng nhập / đăng ký
  const handleAuth = async () => {
    try {
      setError("")
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError("Lỗi: " + err.message)
    }
  }

  // 🔹 Đăng xuất
  const handleLogout = async () => {
    await signOut(auth)
  }

  // 🔹 Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-80">
          <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded-lg p-2 mb-3"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full border rounded-lg p-2 mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-blue-500 text-white rounded-lg py-2 mb-2 hover:bg-blue-600"
          >
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </button>
          <p
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-center text-blue-500 cursor-pointer"
          >
            {isRegister ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
          </p>
        </div>
      </div>
    )
  }

  // 🔹 Nếu đã đăng nhập → giao diện chính
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Quản Lý Chi Tiêu</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>

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
