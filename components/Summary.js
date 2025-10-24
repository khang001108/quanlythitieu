export default function Summary({ items = [], salary = {}, selectedMonth }) {
  const monthSalary = Number(salary[selectedMonth] || 0);
  const total = (items || []).reduce((s, i) => s + Number(i.amount || 0), 0);
  const remaining = monthSalary - total;

  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-lg font-semibold">💰 Lương tháng {selectedMonth + 1}: {monthSalary.toLocaleString()}₫</p>
      <p className="text-lg font-semibold text-blue-600">Tổng chi: {total.toLocaleString()}₫</p>
      <p className={`text-lg font-semibold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>Còn lại: {remaining.toLocaleString()}₫</p>
    </div>
  );
}
