// Success response format
export const successResponse = (
  res,
  statusCode = 200,
  message = "",
  data = {}
) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl, // Path of the request
  });
};

// Error response format
export const errorResponse = (
  res,
  statusCode = 400,
  message = "",
  error = {}
) => {
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    error,
    timestamp: new Date().toISOString(),
    path: res.req.originalUrl, // Path of the request
  });
};
