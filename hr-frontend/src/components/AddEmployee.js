// src/components/AddEmployee.js
import { useState } from "react";
import axios from "axios";

export default function AddEmployee({ onAdded }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "M",
    dob: "2000-01-01",
    email: "",
    phone: "",
    address: "",
    marital_status: "Single",
    job_id: 1,
    department_id: 1,
    base_daily_rate: 200,
    worker_type: "Permanent"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/employees`, form);
      alert("Employee added!");
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to add employee");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded">
      <h2 className="font-bold">Add Employee</h2>
      <input name="first_name" placeholder="First Name" onChange={handleChange} required />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
    </form>
  );
}
