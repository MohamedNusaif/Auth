import { authService } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const authController = {
  async register(req, res) {
    const { name, email, password, role } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      role,
    });

    res
      .cookie("accessToken", result.tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", result.tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
        },
      });
  },

  async login(req, res) {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res
      .cookie("accessToken", result.tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", result.tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
        },
      });
  },

  async refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    const result = await authService.refresh(refreshToken);

    res
      .cookie("accessToken", result.tokens.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", result.tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Token refreshed successfully",
      });
  },

  async logout(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    await authService.logout(refreshToken);

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Logout successful",
      });
  },

  async me(req, res) {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  },
};