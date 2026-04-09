import { db } from "../config/db.js";

export const userRepository = {
  async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT id, name, email, password_hash, role, is_active, created_at, updated_at
       FROM users
       WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, name, email, role, is_active, created_at, updated_at
       FROM users
       WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, passwordHash, role = "client" }) {
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, role]
    );

    return this.findById(result.insertId);
  },
};