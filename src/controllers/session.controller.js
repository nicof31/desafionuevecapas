import UserModel from "../dao/models/users.model.js"
import SessionService from "../services/session.service.js";
import cartsModel from "../dao/models/carts.model.js";
import { appConfig } from "../config/config.js";
const { JWT_COOKIE_NAME } = appConfig;

class SessionController {
    constructor(){
        this.userModel = UserModel;
        this.cartsModel = cartsModel;
        this.sessionService = new SessionService();
    }

    allToRegister = async (req, res) => {
        try {
            const { email } = req.body;
            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
              return res.render("user/registererror", {
                error: "El correo electrónico ya está registrado",
              });
            }
            const addUser = await this.sessionService.allToRegister(req);
            //return res.status(200).json({ status: "sessionController: success mongoose", payload: addUser });
            console.log(`sessionController: Usuario con carrito registrado exitosamente: ${addUser}'`);
            return res.redirect("/login");
        } catch (error) {
            console.error(`sessionController: Error en el registro de usuario: '${error}'`);
            return res.render("user/registererror", {error: "sessionController: Ocurrió un error en el registro de usuario",});
        }
    }

    recoverUser = async (req, res) => {
        try {
            const { email } = req.body;
            console.log("estoy saliendo por recover Capas")
            const existingUser = await this.userModel.findOne({ email });
            if (!existingUser) {
              return res.render("user/recovererror", {
                error: `el usaurio con el mail:${email} no existe`,
              });
            }
            const newPswHashed = await this.sessionService.recoverUser(req);
            console.log(`sessionController: Password cambiado correctamente ${newPswHashed}'`);
            return res.redirect("/login");            
        } catch (error) {
            console.error(`sessionController: Ocurrió un error en cambio de Password: '${error}'`);
            return res.render("user/registererror", {error: "sessionController: Ocurrió un error en cambio de Password",});
        }
    }

    loginUser = async (req, res) => {
      try {
        const token = await this.sessionService.loginUser(req);
        //return res.status(200).json(result);
        return res.cookie(JWT_COOKIE_NAME, token).redirect("/products");
      } catch (error) {
        console.error(`SessionController: No se puede procesar la petición POST '${error}'`);
        return res.status(404).json({ status: "error", message: `SessionController: No se puede procesar la petición POST '${error}'` });
      }
    }

    loginGitHub = async (req, res) => {
      try {
        const token = await this.sessionService.loginGitHub(req); 
        console.log("🚀 ~ file: session.controller.js:66 ~ sessionController ~ loginGitHub= ~ token:", token)
        res
        .cookie(JWT_COOKIE_NAME, token, { httpOnly: true })
        .redirect("/products");
      } catch (error) {
        console.error(`SessionController: Error en el enrutamiento de GitHub callback: ${error}`);
        res.redirect("/login");
      }
    };

    logoutUser = async (req, res) => {
      try {
        console.error(`SessionController: sessión cerrada exitosamente`);
        res.clearCookie(JWT_COOKIE_NAME).redirect("/login");
      } catch (error) {
        console.error(`SessionController: Error al cerrar sesión: ${error}`);
        res.status(500).send({ error: "SessionController: Ocurrió un error al cerrar sesión" });
      }
    }

    processCartReq = async (req, res) => {
      try {
        const cartId = req.params.cid;
        const realizarCompra = req.query.realizarCompra === "true";
        const cart = await this.cartsModel.findById(cartId);
        //const userId = req.user.id;
        if (!cart) {
          return res.status(404).json({ error: "SessionController: Carrito no encontrado" });
        }  
        const user = await this.userModel.findOne({ cart: cartId });
        if (!user) {
          return res.status(404).json({ error: "SessionController: Usuario no encontrado" });
        }
        if (realizarCompra) {
        await this.sessionService.processCartReq(req)
        res.json({ message: "SessionController: Compra realizada con éxito", newCartId: newCart._id });
        } else {
          res.json({ message: "SessionController: Carrito actual", cart });
        }
      } catch (error) {
        res.status(500).json({ error: "SessionController: Error al procesar la solicitud" });
      }
    }

    getCartHistory = async (req, res) => {
      try {
        const { email } = req.user.user;
        const userFindCart = await this.userModel.findOne({ email }).exec();
        const findCartHistory = userFindCart.cartHistory.map((cart) => {
          return {
            cartId: cart.cartId.toString(),
            date: cart.date.toISOString(),
            _id: cart._id.toString(),
          };
        });
        console.log(`SessionController: Solicitud consulta historica carts procesada con exito`); 
        res.render("carts/historycart", { findCartHistory });
      } catch (error) {
        console.log(`SessionController: No se pudo obtener historico carts en BBBD ${error}`);
        return res.status(404).json({ status: "error", message: `SessionController: No se pudo obtener historico carts en BBBD ${error}` });
      }
    };  

    getCurrentUserInfo = async (req, res) => {
      try {
        const { iat, exp } = req.user;
        const { first_name, last_name, email, role, cart, id } = req.user.user;
        const user = {
          first_name,
          last_name,
          email,
          role,
          cart,
          id,
          iat,
          exp,
        };
        console.log(`SessionController: Solicitud consulta datos current procesada con exito`);     
        res.render("user/current", { user });
      } catch (error) {
        console.error(`SessionController: No se puede obtener la información del usuario actual: ${error}`);
        return res.status(500).json({ status: "error", message: `SessionController: No se puede obtener la información del usuario actual: ${error}` });
      }
    };

}


export default SessionController

