import { Router, json } from "express";
import authToken from "../middleware/usersessiontoken.js";
import { generateJWT, passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js"

import CartsController from "../controllers/carts.controller.js";

const router = Router();
const cartController = new CartsController();


    //----------BUSQUEDA POR LIMIT----------------------
//http://localhost:8080/api/carts/
//http://localhost:8080/api/carts/?limit=2

//routerCarts.get("/", [passportCall("jwt"), handlePolicies(["ADMIN","USER"])],  async (req, res) => { 

router.get("/", cartController.getAllCarts);


  //---------------------GET POPULATE---------------------
  //Opcion A: se usa para abrir el carrito http://localhost:8080/api/carts/:cid , esta opcion permite hacer la compra
  //Opcion B: se usa para abrir el historico carrito http://localhost:8080/api/carts/:cid/?historycart=true, esta opcion solo de vista
    //si se usa de postman verlo desd Preview pq la rta esta renderizada

//routerCarts.get("/:cid",[passportCall("jwt"), handlePolicies(["ADMIN","USER"])], async (req, res) => {
router.get("/:cid", cartController.getIdCarts);


//---------------------POST ADD CARTS ---------------------
    //aumentar cantidad y disminuir cantidad debe estar logueado
    //http://localhost:8080/api/carts/${productId}/?accion=aumentar
    //http://localhost:8080/api/carts/${productId}/?accion=disminuir
//routerCarts.post("/:pid", [passportCall("jwt"), handlePolicies(["ADMIN","USER"]),authToken], async (req, res) => {
    router.post(
        "/:pid",
        [passportCall("jwt"), handlePolicies(["ADMIN", "USER"]), authToken],
        cartController.addToCart
      );

//---------------------PUT MODIFICAR CANTIDAD---------------------
//routerCarts.put("/:cid/products/:pid", [passportCall("jwt"), handlePolicies(["ADMIN","USER"])], async (req, res) => { 
    router.put("/:cid/products/:pid", cartController.updateCarts)

//---------------------PUT MODIFICAR COMPLETO---------------------
//routerCarts.put("/:cid",[passportCall("jwt"), handlePolicies(["ADMIN","USER"])], async (req, res) => { 
    router.put("/:cid", cartController.updateCartsComplet)

//---------------------DELETE TODOS LOS PRODUCTOS DEL CARRITO---------------------
// http://localhost:8080/api/carts/:cid
//routerCarts.delete("/:cid", [passportCall("jwt"), handlePolicies(["ADMIN","USER"])], async (req, res) => {
    router.delete("/:cid", cartController.deleteProductCarts)

//---------------------DELETE PRODUCTO DEL CARRITO---------------------
// http://localhost:8080/api/carts/:cid/products/:pid
//routerCarts.delete("/:cid/products/:pid", [passportCall("jwt"), handlePolicies(["ADMIN","USER"])], async (req, res) => {
    router.delete("/:cid/products/:pid", cartController.deleteOneProdCarts)


export default router