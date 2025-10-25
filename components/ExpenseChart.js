// components/ExpenseChart.js
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function ExpenseChart({
  items = [],
  salary = {},
  selectedYear,
}) {
  const [selected, setSelected] = useState(null);
  const [showPie, setShowPie] = useState(false);

  // 🔹 Tổng chi theo tháng (cho dữ liệu month = 0–11)
  const monthlyExpense = {};
  items.forEach((item) => {
    const itemMonth = Number(
      item.month !== undefined
        ? item.month // ✅ dữ liệu Firestore lưu 0–11, không trừ 1
        : item.date
          ? new Date(item.date).getMonth()
          : NaN
    );
    const itemYear = Number(
      item.year ?? (item.date ? new Date(item.date).getFullYear() : NaN)
    );

    if (isNaN(itemMonth) || isNaN(itemYear)) return;
    if (itemYear !== Number(selectedYear)) return;

    monthlyExpense[itemMonth] =
      (monthlyExpense[itemMonth] || 0) + Number(item.amount || 0);
  });

  // 🔹 Dữ liệu biểu đồ
  const data = Array.from({ length: 12 }, (_, i) => {
    const s = salary?.[String(selectedYear)]?.[String(i)] || 0;
    const e = monthlyExpense[i] || 0;
    return {
      month: monthNames[i],
      monthIndex: i,
      Chi: e,
      Lương: s,
      "Còn lại": s - e > 0 ? s - e : 0,
    };
  });

  const totalSalary = Object.values(
    salary?.[String(selectedYear)] || {}
  ).reduce((a, b) => a + b, 0);
  const totalExpense = Object.values(monthlyExpense).reduce((a, b) => a + b, 0);

  // 🔧 Handler click an toàn
  const safeSelect = (payloadOrItem, index, typeLabel) => {
    let payload = null;
    if (payloadOrItem?.payload) payload = payloadOrItem.payload;
    else if (payloadOrItem?.month !== undefined) payload = payloadOrItem;
    else if (typeof index === "number" && data[index]) payload = data[index];
    if (!payload) return;
    setSelected({ ...payload, type: typeLabel });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 relative">
      {/* 🔹 Header */}
      <div className="relative mb-3">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {showPie ? "🥧 Tổng kết năm " : "📊 Biểu đồ chi tiêu & lương năm "}
          {selectedYear}
        </h2>

        {/* 🔘 Nút chuyển nằm sát mép phải */}
        <button
          onClick={() => setShowPie((prev) => !prev)}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 text-2xl transition-transform hover:scale-110"
          title={showPie ? "Xem biểu đồ cột" : "Xem biểu đồ tổng kết"}
        >
          {showPie ? "⬅️" : "➡️"}
        </button>
      </div>

      {/* 🔹 Hiệu ứng chuyển biểu đồ mượt */}
      <div className="relative min-h-[380px] h-[380px] overflow-hidden transition-all duration-300 ease-in-out">
        <AnimatePresence mode="wait">
          {!showPie ? (
            <motion.div
              key="bar"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 30, right: 20, left: -10, bottom: 20 }}
                  barGap={8}
                  barCategoryGap="30%"
                >
                  {/* ⬇️ phần trong BarChart giữ nguyên */}
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                      <stop offset="100%" stopColor="#14532d" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#facc15" stopOpacity={1} />
                      <stop offset="100%" stopColor="#ca8a04" stopOpacity={1} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#555" }}
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) =>
                      v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v.toLocaleString()
                    }
                    tick={{ fontSize: 12, fill: "#555" }}
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={false}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: "#555" }} />
                  <Bar dataKey="Lương" fill="url(#greenGradient)" barSize={35} animationDuration={800} />
                  <Bar dataKey="Chi" fill="url(#redGradient)" barSize={35} animationDuration={900} />
                  <Bar dataKey="Còn lại" fill="url(#yellowGradient)" barSize={25} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <motion.div
              key="pie"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Lương", value: totalSalary },
                      { name: "Chi tiêu", value: totalExpense },
                      { name: "Còn lại", value: Math.max(totalSalary - totalExpense, 0) },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    <Cell fill="#16a34a" />
                    <Cell fill="#dc2626" />
                    <Cell fill="#facc15" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {!showPie && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          🔍 Chạm vào cột để xem chi tiết lương, chi tiêu và số dư từng tháng.
        </p>
      )}

      {/* 🔹 Popup chi tiết */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-2xl w-80 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              {selected.month}{" "}
              {selected.monthIndex !== null
                ? `(${selected.monthIndex + 1}/${selectedYear})`
                : `(${selectedYear})`}{" "}
              - Chi tiết
            </h3>

            <p className="text-gray-600">
              💰 Lương: {Number(selected["Lương"] || 0).toLocaleString()}₫
            </p>
            <p className="text-gray-600">
              💸 Chi tiêu: {Number(selected["Chi"] || 0).toLocaleString()}₫
            </p>
            <p
              className={`text-lg font-bold mt-2 ${selected["Còn lại"] < 0 ? "text-red-600" : "text-green-600"
                }`}
            >
              Còn lại: {Number(selected["Còn lại"] || 0).toLocaleString()}₫
            </p>

            {/* 🔹 Danh sách chi tiêu chi tiết */}
            {(() => {
              const list = items.filter(
                (it) =>
                  Number(it.month) === selected.monthIndex &&
                  Number(it.year) === Number(selectedYear)
              );
              if (!list.length) return null;

              return (
                <div className="mt-3 text-left max-h-40 overflow-y-auto border-t pt-2">
                  <p className="font-semibold text-gray-700 mb-1">
                    Chi tiết khoản chi:
                  </p>
                  {list.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-700 py-1 border-b last:border-0"
                    >
                      <span className="truncate max-w-[60%]">
                        {it.name || "Không tên"}
                      </span>
                      <span>{Number(it.amount).toLocaleString()}₫</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            <button
              onClick={() => setSelected(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
