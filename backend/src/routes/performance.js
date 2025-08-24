import { Router } from 'express';
import { pool } from '../db.js';
import { req as requireFields } from '../utils/validate.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    requireFields(req.body, ['employee_id','score']);
    const { employee_id, score, rating, remarks, review_date } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO Performance (employee_id, review_date, score, rating, remarks)
       VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5) RETURNING *`,
      [employee_id, review_date || null, score, rating || null, remarks || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to add performance score' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { employee_id } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM Performance ${employee_id ? 'WHERE employee_id=$1' : ''} ORDER BY review_date DESC`,
      employee_id ? [employee_id] : []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

export default router;