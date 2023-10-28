import { Router } from "express";
import { CrudController } from "./controllers/crudController.js";

export const router = Router();

router.get('/', (req, res) => res.sendFile(__dirname + './public/index.html'));
router.post('/:productDescription', CrudController.createProduct)
router.put('/:productId/:productDescription', CrudController.updateProduct)
router.get('/products', CrudController.readProducts);
router.delete('/:productId', CrudController.deleteProduct)