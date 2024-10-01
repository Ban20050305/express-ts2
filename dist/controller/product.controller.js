"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("../db/product"));
// Handler to insert a new product
const insertProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price } = req.body;
    // Basic validation
    if (typeof id !== "number" ||
        typeof name !== "string" ||
        typeof price !== "number") {
        return res.status(400).send({
            message: "Invalid input data",
        });
    }
    try {
        yield product_1.default.insertProduct(id, name, price);
        res.status(201).send({
            message: "Product created successfully",
        });
    }
    catch (err) {
        console.error("Error inserting product:", err); // Log the full error
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error", // Ensure error.message is used safely
        });
    }
});
// Handler to delete a product by ID
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).send({
            message: "Invalid ID format",
        });
    }
    try {
        yield product_1.default.deleteProductById(id);
        res.status(204).send(); // No Content
    }
    catch (err) {
        console.error(`Error deleting product with ID ${id}:`, err); // Log the full error
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.message || "Unknown error", // Ensure error.message is used safely
        });
    }
});
const getAll = (req, res) => {
    product_1.default
        .selectAll() //--db/product.ts
        .then((products) => {
        // .then for async call
        res.status(200).send({
            message: "OK",
            result: products,
        });
    })
        .catch((err) => {
        res.status(500).send({
            message: "DATABASE ERROR",
            error: err.code,
        });
    });
};
exports.default = { getAll, deleteById, insertProduct };