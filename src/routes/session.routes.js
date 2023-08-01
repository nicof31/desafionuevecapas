import { Router } from "express";
import passport from "passport";
import { generateJWT, passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js"
import authToken from "../middleware/usersessiontoken.js";


import sessionController from "../controllers/session.controller.js";

const router = Router();
const sessController = new sessionController();

//--------RUTA ALTA USUARIO ---------------
//routerSession.post("/register", async (req, res) => {
    router.post("/register", sessController.allToRegister);

//--------RECOVER----------------
//routerSession.post("/recover-psw", async (req, res) => {
    router.post("/recover-psw", sessController.recoverUser);

//--------RUTA INICIO DE SESION POR TOKEN----------------
//routerSession.post("/login", (req, res, next) => {  
    router.post("/login", sessController.loginUser);


//--------LOGIN GITHUB---------------
    router.get("/github", passport.authenticate("github"));
    
    router.get(
        "/github/callback",
        passport.authenticate("github", { session: false }),
        sessController.loginGitHub
      );

//--------LOG OUT----------------
    router.get("/logout", sessController.logoutUser);


//-----GESTION  DEL CARRITO PARA LA COMPRA-----
    //routerSession.post("/:cid", [passportCall("jwt"), handlePolicies(["ADMIN", "USER"]), authToken], async (req, res) => {
    router.post("/:cid",[passportCall("jwt"), handlePolicies(["ADMIN", "USER"]), authToken], sessController.processCartReq)
   
//-----HISTORY CART----------------------------
    router.get("/historycart", [passportCall("jwt"), handlePolicies(["ADMIN", "USER"])], sessController.getCartHistory);

//-----CURRENT---------------------------------
    router.get("/current", [passportCall("jwt"), handlePolicies(["ADMIN", "USER"])], sessController.getCurrentUserInfo);

export default router