import { useEffect, useState } from "react";
import api from "../api";

function Performance() {
  const [performance, setPerformance] = useState([]);
  const [form, setForm] = useState({ employee_id: "", rating: "" });

  useEffect(() => {
    api.get("/performance").then((res) => setPerformance(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/performance", form);
    const { data } = await api.get("/performance");
    setPerformance(data);
    setForm({ employee_id: "", rating: "" });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Performance</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Rating"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          className="border p-2"
        />
        <button className="bg-purple-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      <ul>
        {performance.map((p) => (
          <li key={p.id}>
            {p.employee_id} — Rating: {p.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Performance;
