import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";


const router = Router();
const productsController = new ProductsController();


//---------------------GET---------------------
//filtro de productos por id
//http://localhost:8080/api/products/:pid
    router.get("/:pid", productsController.getIdProducts);

//filtro de productos convinado
//http://localhost:8080/api/products/?page=2&limit=5&sort=&category=&id= 
    router.get("/", productsController.getCombProducts);

//---------------------POST---------------------
//Crear un nuevo producto
//http://localhost:8080/api/products/
    router.post("/", productsController.addToProduct);

//---------------------PUT---------------------
//update objeto completo
//http://localhost:8080/api/products/:pid 
    router.put("/:pid", productsController.updateProductsComplet);

//---------------------PATCH---------------------
//PACHT para actualizar valores en particular
//http://localhost:8080/api/products/:pid
    router.patch("/:pid", productsController.updateProductsPatch);

//---------------------DELETE---------------------
//http://localhost:8080/api/products/:pid
    router.delete("/:pid", productsController.deleteProduct);

export default router