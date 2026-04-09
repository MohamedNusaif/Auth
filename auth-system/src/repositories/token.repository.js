import { db } from "../config/db.js";

export const tokenRepository = {
  async create({ userId, token, expiresAt }) {
    await db.execute(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES (?, ?, ?)`,
      [userId, token, expiresAt]
    );
  },

  async findValidToken(token) {
    const [rows] = await db.execute(
      `SELECT id, user_id, token, expires_at, revoked_at
       FROM refresh_tokens
       WHERE token = ? AND revoked_at IS NULL
       LIMIT 1`,
      [token]
    );
    return rows[0] || null;
  },

  async revokeToken(token) {
    await db.execute(
      `UPDATE refresh_tokens
       SET revoked_at = NOW()
       WHERE token = ? AND revoked_at IS NULL`,
      [token]
    );
  },

  async revokeAllUserTokens(userId) {
    await db.execute(
      `UPDATE refresh_tokens
       SET revoked_at = NOW()
       WHERE user_id = ? AND revoked_at IS NULL`,
      [userId]
    );
  },
};