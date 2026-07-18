const { validationResult } = require("express-validator");

// Runs after a chain of express-validator checks; short-circuits with a
// 400 + field-level error list if any of them failed.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
