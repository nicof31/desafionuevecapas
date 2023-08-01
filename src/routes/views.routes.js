import { Router } from "express";
import ViewsController from "../controllers/views.controller.js";
import authToken from "../middleware/usersessiontoken.js";
import { passportCall } from "../utils/jwt.js";
import handlePolicies from "../middleware/handle-policies.middleware.js"

const router = Router();
const viewsController = new ViewsController();

//------------CHAT Handlebars-----------------------
    router.get('/chat', viewsController.getChatView);

//------------LOGIN USER----------------------------
    router.get("/", viewsController.getLoginView);
    router.get("/login", viewsController.getLoginView);

//------------LOGOUT--------------------------------
    router.get("/logout", viewsController.logout);

//------------PRODUCTS------------------------------
    router.get("/products", [authToken, passportCall("jwt"), handlePolicies(["ADMIN", "USER", "PUBLIC"])], viewsController.getProductsView);

//------------PROFILE-------------------------------
    router.get("/profile", [passportCall("jwt"), handlePolicies(["ADMIN", "USER", "PUBLIC"])], viewsController.getProfileView);

//------------REGISTER-------------------------------
    router.get("/register", viewsController.getRegisterView);

//------------RECOVER-------------------------------
    router.get("/recover", viewsController.getRecoverView);


export default router