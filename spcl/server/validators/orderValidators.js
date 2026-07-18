const { body, param } = require("express-validator");

const createOrderValidator = [
  body("product").trim().notEmpty().withMessage("Product name is required").isLength({ max: 100 }),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("status").optional().isIn(["pending", "shipped", "delivered", "cancelled"]).withMessage("Invalid status"),
  body("route")
    .trim()
    .notEmpty()
    .withMessage("Route is required")
    .matches(/^.+ to .+$/i)
    .withMessage('Route must be in the form "Origin to Destination"'),
];

const updateOrderStatusValidator = [
  param("id").isMongoId().withMessage("Invalid order id"),
  body("status").isIn(["pending", "shipped", "delivered", "cancelled"]).withMessage("Invalid status"),
];

const idParamValidator = [param("id").isMongoId().withMessage("Invalid order id")];

module.exports = { createOrderValidator, updateOrderStatusValidator, idParamValidator };
