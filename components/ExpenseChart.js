import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function ExpenseChart({ items, salary }) {
  // 🔹 Chi tiêu từng tháng
  const monthlyExpense = {};
  items.forEach(item => {
    const date = new Date(item.date);
    if (isNaN(date)) return;
    const month = date.getMonth();
    monthlyExpense[month] = (monthlyExpense[month] || 0) + Number(item.amount || 0);
  });

  // 🔹 Dữ liệu chart
  const data = Array.from({ length: 12 }, (_, i) => {
    const s = salary[i] || 0;
    const e = monthlyExpense[i] || 0;
    return {
      month: monthNames[i],
      expense: e,
      salary: s,
      remain: s - e > 0 ? s - e : 0,
    };
  });

  // 🔹 Cột tổng
  const totalSalary = Object.values(salary).reduce((a,b)=>a+b,0);
  const totalExpense = Object.values(monthlyExpense).reduce((a,b)=>a+b,0);
  data.push({ month:"Tổng", expense: totalExpense, salary: totalSalary, remain: totalSalary - totalExpense });

  const tooltipFormatter = (value) => `${value.toLocaleString()}₫`;
  const maxY = Math.max(...data.map(d=>Math.max(d.salary,d.expense)),20000000);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">So sánh chi tiêu & lương</h2>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top:20,right:20,left:0,bottom:5 }}>
          <XAxis dataKey="month" />
          <YAxis tickFormatter={v=>`${(v/1000000).toFixed(1)}M`} domain={[0,maxY]} />
          <Tooltip formatter={tooltipFormatter} />

          <Bar dataKey="expense" fill="#ef4444" barSize={30}>
            <LabelList dataKey="expense" position="top" formatter={v=>v>0?v.toLocaleString()+"₫":""} />
          </Bar>
          <Bar dataKey="salary" fill="#10b981" barSize={30}>
            <LabelList dataKey="salary" position="top" formatter={v=>v>0?v.toLocaleString()+"₫":""} />
          </Bar>
          <Bar dataKey="remain" fill="#facc15" barSize={20}>
            <LabelList dataKey="remain" position="insideTop" formatter={v=>v>0?v.toLocaleString()+"₫":""} />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-gray-500 text-sm mt-2">
        Trục Y chia thành mức: Nhẹ &lt;7tr, Trung bình 7-14tr, Cao &gt;14tr
      </div>
    </div>
  );
}
