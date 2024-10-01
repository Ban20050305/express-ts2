"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const productRouter = (0, express_1.Router)();
// specifies the endpoint and the method to call
productRouter.get('/', product_controller_1.default.getAll);
// Endpoint to delete a product by ID
productRouter.delete("/:id", product_controller_1.default.deleteById);
// Endpoint to insert a new product
productRouter.post("/", product_controller_1.default.insertProduct);
// export the router
exports.default = productRouter;