import { Router } from 'express';
import { pool } from '../db.js';
import { req as requireFields } from '../utils/validate.js';

const router = Router();

// Create employee
router.post('/', async (req, res) => {
  try {
    requireFields(req.body, [
      'first_name','last_name','gender','dob','email','phone','address',
      'marital_status','job_id','department_id','base_daily_rate','worker_type'
    ]);

    const {
      first_name, last_name, gender, dob, email, phone, address,
      marital_status, photo_id, hire_date, job_id, department_id,
      base_daily_rate, worker_type, manager_id, warranty_id, status
    } = req.body;

    const q = `INSERT INTO Employees (
      first_name,last_name,gender,dob,email,phone,address,marital_status,photo_id,
      hire_date,job_id,department_id,base_daily_rate,worker_type,manager_id,warranty_id,status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10,CURRENT_DATE),$11,$12,$13,$14,$15,$16,COALESCE($17,'Active'))
    RETURNING *`;

    const vals = [
      first_name, last_name, gender, dob, email, phone, address,
      marital_status, photo_id || null, hire_date || null, job_id, department_id,
      base_daily_rate, worker_type, manager_id || null, warranty_id || null, status || null
    ];

    const { rows } = await pool.query(q, vals);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to create employee' });
  }
});

// List employees (basic)
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT e.*, d.department_name, j.job_title, w.full_name AS warranty_name
      FROM Employees e
      JOIN Departments d ON d.department_id = e.department_id
      JOIN Jobs j ON j.job_id = e.job_id
      LEFT JOIN WarrantyPersons w ON w.warranty_id = e.warranty_id
      ORDER BY e.employee_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Employees WHERE employee_id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const fields = [
      'first_name','last_name','gender','dob','email','phone','address','marital_status','photo_id',
      'hire_date','job_id','department_id','base_daily_rate','worker_type','manager_id','warranty_id','status','termination_date'
    ];
    const entries = Object.entries(req.body).filter(([k,v]) => fields.includes(k));
    if (!entries.length) return res.status(400).json({ error: 'No valid fields to update' });

    const setSql = entries.map(([k], i) => `${k}=$${i+1}`).join(', ');
    const values = entries.map(([,v]) => v);
    values.push(req.params.id);

    const { rows } = await pool.query(`UPDATE Employees SET ${setSql}, updated_at=CURRENT_TIMESTAMP WHERE employee_id=$${values.length} RETURNING *`, values);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Employees WHERE employee_id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;