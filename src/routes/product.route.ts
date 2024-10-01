import { Router } from 'express';
import productController from '../controller/product.controller';
const productRouter = Router();

// specifies the endpoint and the method to call
productRouter.get('/', productController.getAll);
// Endpoint to delete a product by ID
productRouter.delete("/:id", productController.deleteById);

// export the router
export default productRouter;