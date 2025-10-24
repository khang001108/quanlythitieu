import { Wallet, ArrowDownCircle, PiggyBank } from "lucide-react";

export default function Summary({
  items = [],
  salary = {},
  selectedMonth,
  selectedYear,
}) {
  const yearData = salary[String(selectedYear)] || {};
  const monthSalary = Number(yearData[String(selectedMonth)] || 0);
  const total = (items || []).reduce((s, i) => s + Number(i.amount || 0), 0);
  const remaining = monthSalary - total;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl shadow-md border border-blue-100">
      {/* Tiêu đề */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
        📊 Tổng hợp tháng {selectedMonth + 1}/{selectedYear}
      </h2>

      {/* Hàng 1: 2 cột (Lương + Tổng chi) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Lương */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <Wallet className="text-green-600 w-6 h-6 mb-1" />
          <p className="text-sm text-gray-500 font-medium">Lương</p>
          <p className="text-lg font-semibold text-green-600">
            {monthSalary.toLocaleString()}₫
          </p>
        </div>

        {/* Tổng chi */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <ArrowDownCircle className="text-red-500 w-6 h-6 mb-1" />
          <p className="text-sm text-gray-500 font-medium">Tổng chi</p>
          <p className="text-lg font-semibold text-red-500">
            {total.toLocaleString()}₫
          </p>
        </div>
      </div>

      {/* Hàng 2: 1 cột (Còn lại) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
        <PiggyBank
          className={`w-7 h-7 mb-1 ${
            remaining < 0 ? "text-red-500" : "text-blue-600"
          }`}
        />
        <p className="text-sm text-gray-500 font-medium">Còn lại</p>
        <p
          className={`text-2xl font-bold ${
            remaining < 0 ? "text-red-500" : "text-blue-600"
          }`}
        >
          {remaining.toLocaleString()}₫
        </p>
      </div>
    </div>
  );
}
