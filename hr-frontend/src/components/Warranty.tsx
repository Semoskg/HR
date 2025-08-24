import { useEffect, useState } from "react";
import api from "../api";

function Warranty() {
  const [warranty, setWarranty] = useState([]);
  const [form, setForm] = useState({ employee_id: "", details: "" });

  useEffect(() => {
    api.get("/warranty").then((res) => setWarranty(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/warranty", form);
    const { data } = await api.get("/warranty");
    setWarranty(data);
    setForm({ employee_id: "", details: "" });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Warranty</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Warranty Details"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          className="border p-2"
        />
        <button className="bg-orange-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul>
        {warranty.map((w) => (
          <li key={w.id}>
            {w.employee_id} — {w.details}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Warranty;
