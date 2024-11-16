import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { errorResponse } from "../utils/responseHandler.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.accessToken) {
    try {
      token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Attach user to the request
      req.user = await User.findById(decoded.userId).select(
        "-password -refreshToken"
      );

      next();
    } catch (error) {
      return errorResponse(res, 401, "Not authorized, Invalid token");
    }
  }

  if (!token) {
    return errorResponse(res, 401, "Not authorized, no token");
  }
};
