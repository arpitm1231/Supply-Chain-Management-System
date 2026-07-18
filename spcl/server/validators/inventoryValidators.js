const { body, param } = require("express-validator");

const createInventoryValidator = [
  body("product").trim().notEmpty().withMessage("Product name is required").isLength({ max: 100 }),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("city").trim().notEmpty().withMessage("City is required"),
];

const updateStockValidator = [
  param("id").isMongoId().withMessage("Invalid inventory item id"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];

const idParamValidator = [param("id").isMongoId().withMessage("Invalid inventory item id")];

module.exports = { createInventoryValidator, updateStockValidator, idParamValidator };
