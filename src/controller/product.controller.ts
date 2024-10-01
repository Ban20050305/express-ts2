import { Request, Response } from "express";
import product from "../db/product";

// Handler to get all products
const getAll = (req: Request, res: Response) => {
  product
    .selectAll()
    .then((products) => {
      res.status(200).send({
        message: "OK",
        result: products,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "DATABASE ERROR",
        error: err.code || "Unknown error",
      });
    });
};

// Handler to delete a product by student ID
const deleteById = async (req: Request, res: Response) => {
  const studentid = parseInt(req.params.studentid, 10);

  if (isNaN(studentid)) {
    return res.status(400).send({
      message: "Invalid student ID format",
    });
  }

  try {
    await product.deleteProductById(studentid);
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(`Error deleting product with student ID ${studentid}:`, err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// Handler to insert a new product (student)
const insertProduct = async (req: Request, res: Response) => {
  const { studentid, name, lastname } = req.body;

  // Basic validation
  if (
    typeof studentid !== "number" ||
    typeof name !== "string" ||
    typeof lastname !== "string"
  ) {
    return res.status(400).send({
      message: "Invalid input data",
    });
  }

  try {
    await product.insertProduct(studentid, name, lastname);
    res.status(201).send({
      message: "Product created successfully",
    });
  } catch (err) {
    console.error("Error inserting product:", err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// Handler to update an existing product (student) by student ID
const updateProduct = async (req: Request, res: Response) => {
  const studentid = parseInt(req.params.studentid, 10);
  const { name, lastname } = req.body;

  // Basic validation
  if (isNaN(studentid) || typeof name !== "string" || typeof lastname !== "string") {
    return res.status(400).send({
      message: "Invalid input data",
    });
  }

  try {
    await product.updateProduct(studentid, name, lastname);
    res.status(200).send({
      message: `Product with student ID ${studentid} updated successfully`,
    });
  } catch (err) {
    console.error(`Error updating product with student ID ${studentid}:`, err);
    res.status(500).send({
      message: "DATABASE ERROR",
      error: (err as Error).message || "Unknown error",
    });
  }
};

// Exporting all routes
export default { getAll, deleteById, insertProduct, updateProduct };