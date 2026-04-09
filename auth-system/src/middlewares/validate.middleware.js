import { ApiError } from "../utils/api-error.js";

export const validateRegister = (req, _res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return next(new ApiError(400, "Name must be at least 2 characters"));
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return next(new ApiError(400, "Valid email is required"));
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return next(new ApiError(400, "Password must be at least 6 characters"));
  }

  next();
};

export const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Email and password are required"));
  }

  next();
};