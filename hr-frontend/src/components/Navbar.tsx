import React from "react";

export default function Navbar({ setPage }) {
  return (
    <nav className="bg-green-700 p-4 flex gap-4 text-white">
      <button onClick={() => setPage("employees")}>Employees</button>
      <button onClick={() => setPage("attendance")}>Attendance</button>
      <button onClick={() => setPage("payroll")}>Payroll</button>
      <button onClick={() => setPage("performance")}>Performance</button>
      <button onClick={() => setPage("warranty")}>Warranty</button>
    </nav>
  );
}
