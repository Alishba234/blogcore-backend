import ApiError from "../utils/apiError.js";


const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((val) => val.message).join(", "),
    });
  }

  // Handle duplicate key (MongoDB E11000)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Default handler
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandler;
