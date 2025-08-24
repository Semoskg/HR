import { Router } from 'express';
import { pool } from '../db.js';
import { req as requireFields } from '../utils/validate.js';

const router = Router();

// Generate payroll for a SINGLE employee for a given month (YYYY-MM-01)
router.post('/generate-one', async (req, res) => {
  try {
    requireFields(req.body, ['employee_id','month']);
    const { employee_id, month } = req.body; // month like '2025-08-01'

    await pool.query('BEGIN');

    const sql = `
      WITH summary AS (
        SELECT 
          e.employee_id,
          (COUNT(CASE WHEN a.status='Present' THEN 1 END) + 0.5 * COUNT(CASE WHEN a.status='Half-Day' THEN 1 END))::DECIMAL(6,2) AS days_present,
          COALESCE(SUM(a.overtime_hours),0) AS ot
        FROM Employees e
        LEFT JOIN Attendance a ON a.employee_id=e.employee_id AND date_trunc('month', a.work_date)=date_trunc('month',$2::date)
        WHERE e.employee_id=$1
        GROUP BY e.employee_id
      )
      INSERT INTO Payroll (employee_id, month_year, days_present, base_salary, overtime_pay, pension, tax, other_deductions, gross_salary, net_salary)
      SELECT 
        e.employee_id,
        date_trunc('month',$2::date)::date,
        COALESCE(s.days_present,0),
        COALESCE(s.days_present,0) * e.base_daily_rate,
        COALESCE(s.ot,0) * (e.base_daily_rate/8.0),
        ROUND((COALESCE(s.days_present,0) * e.base_daily_rate)*0.07,2),
        ROUND((COALESCE(s.days_present,0) * e.base_daily_rate)*0.15,2),
        0,
        (COALESCE(s.days_present,0) * e.base_daily_rate) + (COALESCE(s.ot,0) * (e.base_daily_rate/8.0)),
        ((COALESCE(s.days_present,0) * e.base_daily_rate) + (COALESCE(s.ot,0) * (e.base_daily_rate/8.0))) - (ROUND((COALESCE(s.days_present,0) * e.base_daily_rate)*0.07,2) + ROUND((COALESCE(s.days_present,0) * e.base_daily_rate)*0.15,2))
      FROM Employees e
      LEFT JOIN summary s ON s.employee_id=e.employee_id
      WHERE e.employee_id=$1
      ON CONFLICT (employee_id, month_year) DO UPDATE SET
        days_present=EXCLUDED.days_present,
        base_salary=EXCLUDED.base_salary,
        overtime_pay=EXCLUDED.overtime_pay,
        pension=EXCLUDED.pension,
        tax=EXCLUDED.tax,
        other_deductions=EXCLUDED.other_deductions,
        gross_salary=EXCLUDED.gross_salary,
        net_salary=EXCLUDED.net_salary,
        generated_at=CURRENT_TIMESTAMP
      RETURNING *;`;

    const { rows } = await pool.query(sql, [employee_id, month]);

    await pool.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to generate payroll' });
  }
});

// Generate payroll for ALL employees for a given month (uses SQL function)
router.post('/generate-month', async (req, res) => {
  try {
    requireFields(req.body, ['month']);
    const { month } = req.body; // 'YYYY-MM-01'
    await pool.query('SELECT generate_monthly_payroll($1)', [month]);
    res.json({ ok: true, month });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to generate monthly payroll' });
  }
});

// List payrolls (filter by employee/month)
router.get('/', async (req, res) => {
  try {
    const { employee_id, month } = req.query;
    const where = [];
    const params = [];
    if (employee_id) { params.push(employee_id); where.push(`employee_id=$${params.length}`); }
    if (month) { params.push(month); where.push(`month_year=date_trunc('month',$${params.length}::date)::date`); }
    const sql = `SELECT * FROM Payroll ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY month_year DESC, employee_id`;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payrolls' });
  }
});

export default router;
