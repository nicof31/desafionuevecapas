import { Router, json } from "express";
import authToken from "../middleware/usersessiontoken.js";
import { generateJWT, passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js"
import ProductsController from "../controllers/products.controller.js";
//import CartsController from "../controllers/carts.controller.js";

const router = Router();
const productsController = new ProductsController();


//------------------------------GET---------------------------------------------//

//filtro de productos por id
//http://localhost:8080/api/products/:pid
 // routerProdructs.get("/:pid", async (req, res) => {
    router.get("/:pid", productsController.getIdProducts);


//filtro de productos convinado
//http://localhost:8080/api/products/?page=2&limit=5&sort=&category=&id=
// routerProdructs.get("/", async (req, res) => {

    router.get("/", productsController.getCombProducts);

//---------------------POST---------------------
//Crear un nuevo producto
//http://localhost:8080/api/products/
 // routerProdructs.post("/", async (req, res) => {
    router.post("/", productsController.addToProduct);

//---------------------PUT---------------------
//update objeto completo
//http://localhost:8080/api/products/:pid 
//routerProdructs.put("/:pid", async (req, res) => {
    router.put("/:pid", productsController.updateProductsComplet);

//---------------------PATCH---------------------
//PACHT para actualizar valores en particular
//http://localhost:8080/api/products/:pid
//routerProdructs.patch("/:pid", async (req, res) => { 
    router.patch("/:pid", productsController.updateProductsPatch);

//---------------------DELETE---------------------
//http://localhost:8080/api/products/:pid
   // routerProdructs.delete("/:pid", async (req, res) => {
    router.delete("/:pid", productsController.deleteProduct);

export default router