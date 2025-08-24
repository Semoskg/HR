import { Router } from 'express';
import { pool } from '../db.js';
import { req as requireFields } from '../utils/validate.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    requireFields(req.body, ['full_name','phone']);
    const { full_name, relation, phone, address } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO WarrantyPersons (full_name, relation, phone, address)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [full_name, relation || null, phone, address || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to add warranty person' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM WarrantyPersons ORDER BY warranty_id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch warranty persons' });
  }
});

export default router;