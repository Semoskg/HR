import { Router } from 'express';
import { pool } from '../db.js';
import { req as requireFields } from '../utils/validate.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    requireFields(req.body, ['employee_id','work_date']);
    const { employee_id, work_date, status, overtime_hours, notes, recorded_by } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO Attendance (employee_id, work_date, status, overtime_hours, notes, recorded_by)
       VALUES ($1,$2,COALESCE($3,'Present'),COALESCE($4,0),$5,$6)
       ON CONFLICT (employee_id, work_date) DO UPDATE SET
         status = EXCLUDED.status,
         overtime_hours = EXCLUDED.overtime_hours,
         notes = EXCLUDED.notes,
         recorded_by = EXCLUDED.recorded_by
       RETURNING *`,
      [employee_id, work_date, status || null, overtime_hours || 0, notes || null, recorded_by || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to record attendance' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { employee_id, start, end } = req.query;
    const params = [];
    const where = [];
    if (employee_id) { params.push(employee_id); where.push(`employee_id = $${params.length}`); }
    if (start) { params.push(start); where.push(`work_date >= $${params.length}`); }
    if (end) { params.push(end); where.push(`work_date <= $${params.length}`); }

    const sql = `SELECT * FROM Attendance ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY work_date DESC`;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

export default router;