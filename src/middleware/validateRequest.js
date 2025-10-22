import ApiError from "../utils/apiError.js";

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((err) => err.message).join(", ");
    return next(new ApiError(400, message));
  }
  next();
};

export default validateRequest;
