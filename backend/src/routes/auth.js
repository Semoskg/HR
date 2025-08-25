import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // store securely!

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, employee_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO Users (username, email, password_hash, role, employee_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING user_id, username, role`,
      [username, email, hashedPassword, role, employee_id || null]
    );

    res.json({ message: "User registered", user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query(
      "SELECT * FROM Users WHERE username=$1 AND status='Active'",
      [username]
    );

    if (rows.length === 0) return res.status(401).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, employee_id: user.employee_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // update last login
    await pool.query("UPDATE Users SET last_login=NOW() WHERE user_id=$1", [user.user_id]);

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
