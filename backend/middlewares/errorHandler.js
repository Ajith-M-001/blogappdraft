//backend\middlewares\errorHandler.js
import { errorResponse } from "../utils/responseHandler.js";

// Not Found Error Handler
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Set 404 status code
  next(error); // Pass the error to the next middleware (the global error handler)
};



// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle specific types of errors and generate a standardized response
  let errorDetails = {
    statusCode,
    message: err.message || "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Handle validation error (e.g., Mongoose validation errors)
  if (err.name === "ValidationError") {
    return errorResponse(
      res,
      statusCode,
      "Validation Error",
      err.errors || err.message
    );
  }

  // Handle CastError (e.g., invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    return errorResponse(res, statusCode, "Invalid ID Format", err.message);
  }

  // Handle MongoDB Duplicate Key Error (e.g., unique field conflict)
  if (err.code === 11000) {
    return errorResponse(res, statusCode, "Duplicate Entry", err.keyValue);
  }

  // Handle any other errors
  return errorResponse(
    res,
    statusCode,
    errorDetails.message,
    errorDetails.error
  );
};

