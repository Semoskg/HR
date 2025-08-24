import { useEffect, useState } from "react";
import api from "../api";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ employee_id: "", work_date: "" });

  useEffect(() => {
    api.get("/attendance").then((res) => setAttendance(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/attendance", form);
    const { data } = await api.get("/attendance");
    setAttendance(data);
    setForm({ employee_id: "", work_date: "" });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Attendance</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.work_date}
          onChange={(e) => setForm({ ...form, work_date: e.target.value })}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul>
        {attendance.map((a) => (
          <li key={a.id}>
            {a.employee_id} — {a.work_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
