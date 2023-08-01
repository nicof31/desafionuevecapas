import UserModel from "../dao/models/users.model.js";
import cartsModel from "../dao/models/carts.model.js";
import CartsManagerMongo from "../dao/managers/cartsmanager.mongodb.js";
import { createHashValue, isValidPasswd } from "../utils/encrypt.js";
import passport from "passport";
import { generateJWT, passportCall } from "../utils/jwt.js";


class SessionService {
    constructor(){
        this.userModel = UserModel;
        this.cartsModel = cartsModel;
        this.cartsManagerMongo = new CartsManagerMongo();
    }

    allToRegister= async (req) => {
        try {
            const { first_name, last_name, email, password, age, role } = req.body;
            const pswHashed = await createHashValue(password);
            const newUser = await this.userModel.create({
              email,
              password: pswHashed,
              first_name,
              last_name,
              age,
              role,
              cart: null,
            });
            console.log("sessionService: Usuario registrado exitosamente:", newUser);
            const idUser = newUser._id.toString() 
            console.log("🚀 ~ file: session.router.js:46 ~ routerSession.post ~ idUser:", idUser)
        
            const newUserWithCart = await this.cartsManagerMongo.addCartsRegister(idUser);
            console.log("Usuario con carrito registrado exitosamente:", newUserWithCart);
        
            newUser.cart = newUserWithCart._id;
            await newUser.save();
        
            console.log("sessionService: Usuario con carrito registrado exitosamente:", newUser);
            return newUser;
        } catch (error) {
            console.log(`sessionService: no se pudo registrar usuario: '${error}'`)
            throw error;    
        }
    }

    recoverUser = async (req) => {
        try {
            const { email, new_password } = req.body;
            const existingUser = await this.userModel.findOne({ email });
            const newPswHashed = await createHashValue(new_password);
            await this.userModel.findByIdAndUpdate(existingUser._id, {
              password: newPswHashed,
            });
            console.log(`sessionService: Password cambiado correctamente ${newPswHashed}`);
            return newPswHashed;            
        } catch (error) {
            console.log(`sessionService: no se pudo cambiar Password: '${error}'`)
            throw error;    
        }
    }

    loginUser = async (req) => {
        return new Promise((resolve, reject) => {
        passport.authenticate("login", async (err, user, info) => {
            if (err) {
            console.error(`sessionService: Error en la autenticación: ${err}`);
            reject({ error: "(401): sessionService Ocurrió un error en la autenticación" });
            }
            if (!user) {
            reject({ error: "(401): sessionService Credenciales inválidas" });
            }
            try {
            const signUser = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                id: user._id,
            };
            const token = await generateJWT({ ...signUser });
            console.log("🚀 ~ sessionService ~ token:", token);
            resolve (token);
            } catch (error) {
            console.error(`sessionService: Error al generar el token: ${error}`);
            reject({ error: "sessionService: Error en el servidor" });
            }
        })(req);
        });
    }

    loginGitHub = async (req) => {
        try {       
        const token =  req.user;
        console.log("🚀 ~ sessionService ~ token:", token);
        return token;
        } catch (error) {
        console.error(`sessionService: Error al generar el token: ${error}`);
        throw error;
        }
    }
    
    processCartReq = async (req) => {
        try {
        const cartId = req.params.cid;
        const realizarCompra = req.query.realizarCompra === "true";
        const cart = await this.cartsModel.findById(cartId);
        const user = await this.userModel.findOne({ cart: cartId });

        if (realizarCompra) {
        await user.realizarCompra();
        user.cartHistory.push({ cartId: cart._id, date: Date.now() });
        const newCart = await user.createNewCart();
        return newCart;
        }else {
        return cart;
          }
        } catch (error) {
        console.error(`sessionService: Error al procesar la solicitud: ${error}`);
        throw error;
        }
    }
}


export default SessionService;