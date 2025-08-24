import { useEffect, useState } from "react";
import api from "../api";

function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(""); // new state for month

  useEffect(() => {
    api.get("/payroll").then((res) => setPayroll(res.data));
  }, []);

  const generatePayroll = async (e) => {
    e.preventDefault();

    if (!employeeId || !month) {
      alert("Please enter Employee ID and select Month");
      return;
    }

    try {
      await api.post("/payroll/generate-one", { employee_id: employeeId, month });
      const { data } = await api.get("/payroll");
      setPayroll(data);
      setEmployeeId("");
      setMonth("");
    } catch (err) {
      console.error(err);
      alert("Failed to generate payroll. Make sure employee ID and month are valid.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Payroll</h2>
      <form onSubmit={generatePayroll} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border p-2"
        />
        <input
          type="month" // month picker
          value={month}
          onChange={(e) => setMonth(e.target.value + "-01")} // convert YYYY-MM to YYYY-MM-01
          className="border p-2"
        />
        <button className="bg-green-500 text-white px-3 py-1 rounded">
          Generate Payroll
        </button>
      </form>

      <ul>
        {payroll.map((p) => (
          <li key={p.id}>
            {p.employee_id} — {p.net_salary} Birr ({p.month_year})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Payroll;
