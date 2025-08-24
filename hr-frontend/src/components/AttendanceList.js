
import { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/attendance`)
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Attendance Records</h2>
      <ul>
        {records.map((r, i) => (
          <li key={i}>{r.employee_id} - {r.work_date} ({r.status})</li>
        ))}
      </ul>
    </div>
  );
}
