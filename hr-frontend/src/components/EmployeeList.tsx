import React, { useEffect, useState } from "react";
import api from "../api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "", gender: "", dob: "", email: "" });

  useEffect(() => {
    api.get("/employees").then(res => setEmployees(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/employees", form);
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employees</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="First Name" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
        <input className="border p-2" placeholder="Last Name" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
        <input className="border p-2" placeholder="Gender" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} />
        <input className="border p-2" type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
        <input className="border p-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        
        <button className="bg-green-600 text-white px-4">Add</button>
      </form>
      <ul>
        {employees.map(emp => (
          <li key={emp.employee_id} className="border p-2 mb-2 rounded">
            {emp.first_name} {emp.last_name} - {emp.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
