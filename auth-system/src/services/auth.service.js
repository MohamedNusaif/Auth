import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";
import { userRepository } from "../repositories/user.repository.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { tokenService } from "./token.service.js";
import { verifyRefreshToken } from "../utils/jwt.js";

export const authService = {
  async register({ name, email, password, role }) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role,
    });

    const tokens = await tokenService.generateAuthTokens(user);

    return { user, tokens };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.is_active) {
      throw new ApiError(403, "User account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const tokens = await tokenService.generateAuthTokens(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const storedToken = await tokenRepository.findValidToken(refreshToken);

    if (!storedToken) {
      throw new ApiError(401, "Refresh token not recognized");
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      await tokenRepository.revokeToken(refreshToken);
      throw new ApiError(401, "Refresh token expired");
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      await tokenRepository.revokeToken(refreshToken);
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await userRepository.findById(decoded.sub);

    if (!user || !user.is_active) {
      throw new ApiError(401, "User not found or inactive");
    }

    await tokenRepository.revokeToken(refreshToken);

    const tokens = await tokenService.generateAuthTokens(user);

    return {
      user,
      tokens,
    };
  },

  async logout(refreshToken) {
    if (!refreshToken) return;
    await tokenRepository.revokeToken(refreshToken);
  },
};