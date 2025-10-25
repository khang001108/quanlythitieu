  import { useState } from "react";
  import { Wallet, ArrowDownCircle, PiggyBank, Eye, EyeOff } from "lucide-react";

  export default function Summary({
    items = [],
    salary = {},
    selectedMonth,
    selectedYear,
  }) {
    const [showValues, setShowValues] = useState(false); // 🔹 Mặc định ẩn

    const yearData = salary[String(selectedYear)] || {};
    const monthSalary = Number(yearData[String(selectedMonth)] || 0);
    const total = (items || []).reduce((s, i) => s + Number(i.amount || 0), 0);
    const remaining = monthSalary - total;

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl shadow-md border border-blue-100">
        {/* Tiêu đề + Nút ẩn/hiện */}
        <div className="flex items-center justify-center mb-4 relative">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📊 Tổng hợp tháng {selectedMonth + 1}/{selectedYear}
          </h2>
          <button
            onClick={() => setShowValues((v) => !v)}
            className="absolute right-0 text-gray-500 hover:text-gray-700 transition"
            title={showValues ? "Ẩn giá trị" : "Hiện giá trị"}
          >
            {showValues ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Hàng 1: Lương + Tổng chi */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Lương */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <Wallet className="text-green-600 w-6 h-6 mb-1" />
            <p className="text-sm text-gray-500 font-medium">Lương</p>
            <p className="text-lg font-semibold text-green-600 transition-all duration-200">
              {showValues ? `${monthSalary.toLocaleString()}₫` : "••••••"}
            </p>
          </div>

          {/* Tổng chi */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <ArrowDownCircle className="text-red-500 w-6 h-6 mb-1" />
            <p className="text-sm text-gray-500 font-medium">Tổng chi</p>
            <p className="text-lg font-semibold text-red-500 transition-all duration-200">
              {showValues ? `${total.toLocaleString()}₫` : "••••••"}
            </p>
          </div>
        </div>

        {/* Hàng 2: Còn lại */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <PiggyBank
            className={`w-7 h-7 mb-1 ${
              remaining < 0 ? "text-red-500" : "text-blue-600"
            }`}
          />
          <p className="text-sm text-gray-500 font-medium">Còn lại</p>
          <p
            className={`text-2xl font-bold transition-all duration-200 ${
              remaining < 0 ? "text-red-500" : "text-blue-600"
            }`}
          >
            {showValues ? `${remaining.toLocaleString()}₫` : "••••••"}
          </p>
        </div>
      </div>
    );
  }
