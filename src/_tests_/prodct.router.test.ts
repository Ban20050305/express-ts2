import request from "supertest";
import express from "express";
import productRouter from "../../dist/routes/product.route";

// Mock productController methods
jest.mock("../controller/product.controller", () => ({
  getAll: jest.fn((req, res) =>
    res.status(200).send({
      message: "OK",
      result: [{ id: 1, name: "Product 1" }],
    })
  ),
  deleteById: jest.fn((req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }
    res.status(204).send(); // No Content
  }),
  insertProduct: jest.fn((req, res) => {
    const { id, name, price } = req.body;
    if (
      typeof id !== "number" ||
      typeof name !== "string" ||
      typeof price !== "number"
    ) {
      return res.status(400).send({ message: "Invalid input data" });
    }
    res.status(201).send({ message: "Product created successfully" });
  }),
  updateProduct: jest.fn((req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, price } = req.body;
    if (isNaN(id) || typeof name !== "string" || typeof price !== "number") {
      return res.status(400).send({ message: "Invalid input data" });
    }
    res
      .status(200)
      .send({ message: `Product with ID ${id} updated successfully` });
  }),
}));

const app = express();
app.use(express.json());
app.use("/products", productRouter);

describe("Product Router", () => {
  it("should get all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "OK",
      result: [{ id: 1, name: "Product 1" }],
    });
  });

  it("should delete a product by ID", async () => {
    const response = await request(app).delete("/products/1");
    expect(response.status).toBe(204); // Updated to 204 No Content
  });

  it("should handle invalid ID format in delete request", async () => {
    const response = await request(app).delete("/products/invalid-id");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid ID format" });
  });

  it("should insert a new product", async () => {
    const newProduct = { id: 2, name: "New Product", price: 20 };
    const response = await request(app).post("/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Product created successfully" });
  });

  it("should handle invalid input data in insert request", async () => {
    const invalidProduct = {
      id: "string",
      name: "Invalid Product",
      price: "not-a-number",
    };
    const response = await request(app).post("/products").send(invalidProduct);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid input data" });
  });

  it("should update an existing product by ID", async () => {
    const updatedProduct = { name: "Updated Product", price: 25 };
    const response = await request(app).put("/products/1").send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Product with ID 1 updated successfully",
    });
  });

  it("should handle invalid input data in update request", async () => {
    const invalidUpdate = { name: "Updated Product", price: "not-a-number" };
    const response = await request(app).put("/products/1").send(invalidUpdate);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid input data" });
  });
});