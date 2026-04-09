import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { tokenRepository } from "../repositories/token.repository.js";

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export const tokenService = {
  async generateAuthTokens(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const expiresAt = addDays(new Date(), 7);

    await tokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  },
};