import React, { useState } from "react";
import Navbar from "./components/Navbar.tsx";
import EmployeeList from "./components/EmployeeList.tsx";
import Attendance from "./components/Attendance.tsx";
import Payroll from "./components/Payroll.tsx";
import Performance from "./components/Performance.tsx";
import Warranty from "./components/Warranty.tsx";

function App() {
  const [page, setPage] = useState("employees");

  return (
    <div>
      <Navbar setPage={setPage} />
      {page === "employees" && <EmployeeList />}
      {page === "attendance" && <Attendance />}
      {page === "payroll" && <Payroll />}
      {page === "performance" && <Performance />}
      {page === "warranty" && <Warranty />}
    </div>
  );
}

export default App;
