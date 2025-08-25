import express from 'express';
import cors from 'cors';
import { pool, ping } from './db.js';

import employeesRouter from './routes/employees.js';
import warrantyRouter from './routes/warranty.js';
import attendanceRouter from './routes/attendance.js';
import payrollRouter from './routes/payroll.js';
import performanceRouter from './routes/performance.js';
import authRoutes from "./routes/auth.js"; 

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // frontend port
}));
app.use(express.json());
ping(); 
app.get('/', async (req, res) => {
  const now = await ping();
  res.json({ ok: true, db_now: now });
});

app.use('/employees', employeesRouter);
app.use('/warranty', warrantyRouter);
app.use('/attendance', attendanceRouter);
app.use('/payroll', payrollRouter);
app.use('/performance', performanceRouter);
app.use("/auth", authRoutes); // Auth routes
const PORT = process.env.PORT ||  5000;
app.listen(PORT, () => console.log(`HR API running on http://localhost:${PORT}`));