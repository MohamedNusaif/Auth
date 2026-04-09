import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = req.cookies?.accessToken || bearerToken;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

export const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to access this resource"));
    }

    next();
  };
};