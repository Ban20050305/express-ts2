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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
// Function to delete a product by ID
const deleteProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Attempting to delete product with ID: ${id}`);
        const [result] = yield db_1.promisePool.query("DELETE FROM product WHERE id = ?", [id]);
        console.log("Delete result:", result);
        // Optionally, you can check if the affectedRows property is 0 to handle the case where no rows were deleted
        if (result.affectedRows === 0) {
            console.warn(`No product found with ID: ${id}`);
        }
    }
    catch (err) {
        console.error("Database deletion error:", err);
        throw err; // It's good practice to throw the error after logging it
    }
});
// Function to insert a new product
const insertProduct = (id, name, price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield db_1.promisePool.query("INSERT INTO product (id, name, price) VALUES (?, ?, ?)", [id, name, price]);
        console.log("Insert result:", result);
        if (result.affectedRows === 0) {
            console.warn("Insert operation did not affect any rows");
        }
    }
    catch (err) {
        console.error("Database insertion error:", err);
        throw err;
    }
});
const selectAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.promisePool.query("SELECT * FROM product");
        return rows;
    }
    catch (err) {
        console.error("Database query error:", err);
    }
});
exports.default = { selectAll, deleteProductById, insertProduct };